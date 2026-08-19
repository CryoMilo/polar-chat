import React, { useState, useEffect, useRef } from "react";
import { useMobileChat } from "../../contexts/MobileChatContext";
import { useConversationContext } from "../../contexts/ConversationsContext";
import { useAuthStore } from "../../../stores/authStore";
import { useSocketContext } from "../../contexts/SocketContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import messageService from "../../services/messageService";
import type { Message } from "../../services/messageService";
import { toast } from "sonner";
import ChatHeader from "./ChatHeader";
import MessageFeed from "./MessageFeed";
import MessageInput from "./MessageInput";

const ChatWindow: React.FC = () => {
	const { setIsMobileChatOpen } = useMobileChat();
	const { activeConversation, typingStatus } = useConversationContext();
	const { user } = useAuthStore();
	const { socket } = useSocketContext();
	const [inputText, setInputText] = useState("");
	const [messages, setMessages] = useState<Message[]>([]);
	const feedRef = useRef<HTMLDivElement | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);

	const [isLocalTyping, setIsLocalTyping] = useState(false);
	const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const [hasMore, setHasMore] = useState(true);
	const [isFetchingEarlier, setIsFetchingEarlier] = useState(false);

	if (!activeConversation) {
		throw new Error("ChatWindow rendered without an active conversation");
	}

	const { friend, conversationId } = activeConversation;
	const isFriendTyping = typingStatus[conversationId];

	const { data: fetchedMessages, isLoading } = useQuery({
		queryKey: ["messages", conversationId],
		queryFn: () => messageService.fetchMessages(conversationId),
		enabled: !!conversationId,
	});

	const { mutate: sendMessage, isPending: isSending } = useMutation({
		mutationFn: (content: string) =>
			messageService.sendMessage(conversationId, content),
		onSuccess: (newMessage) => {
			setMessages((prev) => {
				if (prev.some((m) => m._id === newMessage._id)) return prev;
				return [...prev, newMessage];
			});
			setInputText("");
			requestAnimationFrame(() => scrollToBottom("smooth"));
		},
		onError: () => {
			toast.error("Failed to send message. Please try again.");
		},
	});

	useEffect(() => {
		if (fetchedMessages) {
			setMessages(fetchedMessages);
			if (fetchedMessages.length < 20) {
				setHasMore(false);
			} else {
				setHasMore(true);
			}
			requestAnimationFrame(() => {
				if (feedRef.current) {
					feedRef.current.scrollTop = feedRef.current.scrollHeight;
				}
			});
		}
	}, [fetchedMessages]);

	useEffect(() => {
		if (!socket || !conversationId) return;

		const handleNewMessage = (newMessage: any) => {
			if (newMessage.conversation === conversationId) {
				setMessages((prev) => {
					if (prev.some((m) => m._id === newMessage._id)) return prev;
					return [...prev, newMessage];
				});
				messageService.markAsRead(conversationId).catch(console.error);
			}
		};

		socket.on("message:new", handleNewMessage);
		return () => {
			socket.off("message:new", handleNewMessage);
		};
	}, [socket, conversationId]);

	const scrollToBottom = (behavior: "smooth" | "auto" = "smooth") => {
		if (feedRef.current) {
			feedRef.current.scrollTo({
				top: feedRef.current.scrollHeight,
				behavior,
			});
		}
	};

	// Auto-scroll on new messages if near bottom
	useEffect(() => {
		const container = feedRef.current;
		if (container) {
			const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
			if (isNearBottom || isFriendTyping) {
				scrollToBottom("smooth");
			}
		}
	}, [messages.length, isFriendTyping]);

	useEffect(() => {
		return () => {
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}
		};
	}, [conversationId]);

	// Auto-focus input field on active conversation change
	useEffect(() => {
		inputRef.current?.focus();
	}, [conversationId]);

	const fetchEarlierMessages = async () => {
		if (isFetchingEarlier || !hasMore || messages.length === 0) return;

		setIsFetchingEarlier(true);

		const oldestMessage = messages[0];
		const oldestTimestamp = oldestMessage.createdAt;

		try {
			const container = feedRef.current;
			const previousScrollHeight = container ? container.scrollHeight : 0;

			const limit = 20;
			const earlier = await messageService.fetchMessages(conversationId, limit, oldestTimestamp);

			if (earlier.length < limit) {
				setHasMore(false);
			}

			if (earlier.length > 0) {
				setMessages((prev) => {
					const newMsgs = earlier.filter((em) => !prev.some((pm) => pm._id === em._id));
					return [...newMsgs, ...prev];
				});

				requestAnimationFrame(() => {
					if (container) {
						const newScrollHeight = container.scrollHeight;
						container.scrollTop = newScrollHeight - previousScrollHeight;
					}
				});
			}
		} catch (error) {
			console.error("Error fetching earlier messages:", error);
		} finally {
			setIsFetchingEarlier(false);
		}
	};

	const handleScroll = () => {
		const container = feedRef.current;
		if (!container) return;

		if (container.scrollTop === 0) {
			fetchEarlierMessages();
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputText(e.target.value);

		if (!socket || !conversationId) return;

		if (!isLocalTyping) {
			setIsLocalTyping(true);
			socket.emit("typing:start", { conversationId, recipientId: friend.id });
		}

		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
		}

		typingTimeoutRef.current = setTimeout(() => {
			setIsLocalTyping(false);
			socket.emit("typing:stop", { conversationId, recipientId: friend.id });
		}, 2000);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!inputText.trim() || isSending) return;

		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
		}
		if (isLocalTyping) {
			setIsLocalTyping(false);
			socket?.emit("typing:stop", { conversationId, recipientId: friend.id });
		}

		sendMessage(inputText.trim());
		inputRef.current?.focus();
	};

	return (
		<div className="flex-1 flex flex-col h-full bg-[#0b0f19]">
			<ChatHeader
				friend={friend}
				isFriendTyping={isFriendTyping}
				onBack={() => setIsMobileChatOpen(false)}
			/>

			<MessageFeed
				feedRef={feedRef}
				onScroll={handleScroll}
				isLoading={isLoading}
				messages={messages}
				user={user}
				isFetchingEarlier={isFetchingEarlier}
				isFriendTyping={isFriendTyping}
			/>

			<MessageInput
				inputRef={inputRef}
				inputText={inputText}
				onChange={handleInputChange}
				onSubmit={handleSubmit}
				isSending={isSending}
			/>
		</div>
	);
};

export default ChatWindow;
