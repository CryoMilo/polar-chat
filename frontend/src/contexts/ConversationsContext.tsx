import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { User } from "../../stores/authStore";
import { useAuthStore } from "../../stores/authStore";
import { useConversations } from "../hooks/useConversation";
import { useSocketContext } from "./SocketContext";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import messageService from "../services/messageService";

export type Conversation = {
	conversationId: string;
	friend: User & {
		online: boolean;
	};
	unreadCounts: Record<string, number>;
	lastMessage: {
		content: string;
		timestamp: Date;
	} | null;
};

type ConversationsContextype = {
	conversations: Conversation[];
	filteredConversations: Conversation[];
	searchTerm: string;
	setSearchTerm: (term: string) => void;
	activeConversation: Conversation | null;
	setActiveConversation: (conversation: Conversation | null) => Promise<void>;
	typingStatus: Record<string, boolean>;

	isLoading: boolean;
	isError: boolean;
};

export type FriendOnlineStatus = {
	friendId: string;
	username: string;
	online: boolean;
};

const ConversationsContext = createContext<ConversationsContextype | undefined>(
	undefined
);

// Clean hook to call context
// eslint-disable-next-line react-refresh/only-export-components
export const useConversationContext = () => {
	const context = useContext(ConversationsContext);
	if (!context)
		throw new Error(
			"useConversationsContext must be used within Conversations Provider"
		);
	return context;
};

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { data, isLoading, isError } = useConversations();
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [activeConversation, setActiveConversationState] = useState<Conversation | null>(null);
	const [typingStatus, setTypingStatus] = useState<Record<string, boolean>>({});
	const { socket } = useSocketContext();
	const { user } = useAuthStore();
	const queryClient = useQueryClient();

	const conversationsRef = useRef<Conversation[]>([]);
	const activeConversationRef = useRef<Conversation | null>(null);

	useEffect(() => {
		conversationsRef.current = conversations;
	}, [conversations]);

	useEffect(() => {
		activeConversationRef.current = activeConversation;
	}, [activeConversation]);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		if (data) setConversations(data.data);
	}, [data]);

	const setActiveConversation = async (conversation: Conversation | null) => {
		setActiveConversationState(conversation);
		if (conversation) {
			try {
				await messageService.markAsRead(conversation.conversationId);
				setConversations((prev) => {
					return prev.map((c) => {
						if (c.conversationId === conversation.conversationId) {
							const clearedUnread = { ...c.unreadCounts };
							if (user) {
								clearedUnread[user.id] = 0;
							}
							return {
								...c,
								unreadCounts: clearedUnread,
							};
						}
						return c;
					});
				});
			} catch (error) {
				console.error("Failed to mark conversation as read:", error);
			}
		}
	};

	const sortedConversations = [...(conversations || [])].sort((a, b) => {
		const timeA = a.lastMessage?.timestamp ? new Date(a.lastMessage.timestamp).getTime() : 0;
		const timeB = b.lastMessage?.timestamp ? new Date(b.lastMessage.timestamp).getTime() : 0;
		return timeB - timeA;
	});

	const filteredConversations = sortedConversations.filter((c) =>
		c.friend.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
		c.friend.username.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleConversationOnlineStatus = ({
		friendId,
		username,
		online,
	}: FriendOnlineStatus) => {
		const friendConversation = conversationsRef.current?.find(
			(c) => c.friend.id === friendId
		);

		if (friendConversation && friendConversation.friend.online !== online) {
			toast.info(`${username} is ${online ? "online" : "offline"}`);
		}

		setConversations((prev) => {
			return prev.map((conversation) => {
				if (conversation.friend.id === friendId) {
					return {
						...conversation,
						friend: { ...conversation.friend, online },
					};
				}
				return conversation;
			});
		});
	};

	useEffect(() => {
		socket?.on("conversation:online-status", handleConversationOnlineStatus);

		const handleNewMessageGlobal = (newMessage: any) => {
			const activeConv = activeConversationRef.current;
			setConversations((prev) => {
				return prev.map((c) => {
					if (c.conversationId === newMessage.conversation) {
						const updatedUnread = { ...c.unreadCounts };
						if (!activeConv || activeConv.conversationId !== c.conversationId) {
							if (user) {
								updatedUnread[user.id] = (updatedUnread[user.id] || 0) + 1;
							}
						}
						return {
							...c,
							lastMessage: {
								content: newMessage.content,
								timestamp: new Date(newMessage.createdAt),
							},
							unreadCounts: updatedUnread,
						};
					}
					return c;
				});
			});
		};

		const handleTypingStart = (data: { conversationId: string }) => {
			setTypingStatus((prev) => ({ ...prev, [data.conversationId]: true }));
		};

		const handleTypingStop = (data: { conversationId: string }) => {
			setTypingStatus((prev) => ({ ...prev, [data.conversationId]: false }));
		};

		const handleNewConversation = () => {
			queryClient.invalidateQueries({ queryKey: ["conversations"] });
		};

		socket?.on("conversation:new", handleNewConversation);
		socket?.on("message:new", handleNewMessageGlobal);
		socket?.on("typing:start", handleTypingStart);
		socket?.on("typing:stop", handleTypingStop);

		return () => {
			socket?.off("conversation:online-status", handleConversationOnlineStatus);
			socket?.off("conversation:new", handleNewConversation);
			socket?.off("message:new", handleNewMessageGlobal);
			socket?.off("typing:start", handleTypingStart);
			socket?.off("typing:stop", handleTypingStop);
		};
	}, [socket, user]);

	return (
		<ConversationsContext.Provider
			value={{
				conversations,
				filteredConversations,
				searchTerm,
				setSearchTerm,
				activeConversation,
				setActiveConversation,
				typingStatus,
				isLoading,
				isError,
			}}>
			{children}
		</ConversationsContext.Provider>
	);
};
