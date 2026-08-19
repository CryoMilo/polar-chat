import React, { useState, useEffect, useRef } from "react";
import {
	Send,
	Image,
	Smile,
	Phone,
	Video,
	MoreVertical,
	Paperclip,
	ArrowLeft,
} from "lucide-react";
import { useMobileChat } from "../../contexts/MobileChatContext";
import { useConversationContext } from "../../contexts/ConversationsContext";
import { useAuthStore } from "../../../stores/authStore";
import { useSocketContext } from "../../contexts/SocketContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import messageService from "../../services/messageService";
import { format } from "date-fns";
import { toast } from "sonner";

const ChatWindow: React.FC = () => {
	const { setIsMobileChatOpen } = useMobileChat();
	const { activeConversation } = useConversationContext();
	const { user } = useAuthStore();
	const { socket } = useSocketContext();
	const [inputText, setInputText] = useState("");
	const [messages, setMessages] = useState<any[]>([]);
	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	if (!activeConversation) {
		throw new Error("ChatWindow rendered without an active conversation");
	}

	const { friend, conversationId } = activeConversation;

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
		},
		onError: () => {
			toast.error("Failed to send message. Please try again.");
		},
	});

	useEffect(() => {
		if (fetchedMessages) {
			setMessages(fetchedMessages);
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

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!inputText.trim() || isSending) return;
		sendMessage(inputText.trim());
	};

	return (
		<div className="flex-1 flex flex-col h-full bg-[#0b0f19]">
			{/* Chat Header */}
			<div className="flex items-center justify-between p-4 border-b border-blue-50/10 bg-[#0f172a] text-white">
				<div className="flex items-center gap-3">
					{/* Back Button (Mobile Only) */}
					<button
						onClick={() => setIsMobileChatOpen(false)}
						className="md:hidden p-2 -ml-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors duration-200"
					>
						<ArrowLeft size={20} />
					</button>

					<div className="relative">
						<img
							src={`https://avatarapi.runflare.run/public?usearname=${friend.username}`}
							alt={friend.fullname}
							className="w-10 h-10 rounded-full object-cover border border-slate-700"
						/>
						{friend.online ? (
							<span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
						) : (
							<span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-slate-500 ring-2 ring-slate-900" />
						)}
					</div>
					<div>
						<h3 className="text-sm font-semibold text-slate-200">
							{friend.fullname}
						</h3>
						<span className="text-xs text-slate-500">
							{friend.online ? "online" : "offline"}
						</span>
					</div>
				</div>
				<div className="flex items-center gap-1">
					<button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors duration-200">
						<Phone size={18} />
					</button>
					<button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors duration-200">
						<Video size={18} />
					</button>
					<button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors duration-200">
						<MoreVertical size={18} />
					</button>
				</div>
			</div>

			{/* Messages Feed */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{isLoading ? (
					<div className="h-full flex items-center justify-center">
						<div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
					</div>
				) : messages.length === 0 ? (
					<div className="h-full flex flex-col items-center justify-center text-slate-500">
						<Smile size={40} className="mb-2 stroke-1" />
						<p className="text-sm">Say hello to your new friend!</p>
					</div>
				) : (
					messages.map((msg) => {
						const isMe = msg.sender === user?.id;
						const timeStr = msg.createdAt
							? format(new Date(msg.createdAt), "h:mm a")
							: "";
						return (
							<div
								key={msg._id}
								className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
								<div
									className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
										isMe
											? "bg-blue-600 text-white rounded-br-none shadow-lg shadow-blue-600/15"
											: "bg-slate-800/80 text-slate-200 rounded-bl-none border border-slate-700/30"
									}`}>
									<p className="leading-relaxed wrap-break-word">{msg.content}</p>
									<span
										className={`block text-[10px] mt-1 text-right ${
											isMe ? "text-blue-200" : "text-slate-500"
										}`}>
										{timeStr}
									</span>
								</div>
							</div>
						);
					})
				)}
				<div ref={messagesEndRef} />
			</div>

			{/* Message Input Section */}
			<div className="p-4 border-t border-blue-50/10 bg-[#0f172a]">
				<form
					className="flex items-center gap-2"
					onSubmit={handleSubmit}>
					<button
						type="button"
						className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors duration-200">
						<Paperclip size={20} />
					</button>
					<button
						type="button"
						className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors duration-200">
						<Image size={20} />
					</button>
					<button
						type="button"
						className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors duration-200">
						<Smile size={20} />
					</button>
					<input
						type="text"
						value={inputText}
						onChange={(e) => setInputText(e.target.value)}
						placeholder="Type a message..."
						disabled={isSending}
						className="flex-1 bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
					/>
					<button
						type="submit"
						disabled={isSending || !inputText.trim()}
						className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/10 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:active:scale-100">
						<Send size={20} />
					</button>
				</form>
			</div>
		</div>
	);
};

export default ChatWindow;
