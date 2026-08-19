import React, { useState } from "react";
import { Smile, Check, CheckCheck } from "lucide-react";
import { format } from "date-fns";
import type { Message } from "../../services/messageService";
import type { User } from "../../../stores/authStore";

interface MessageFeedProps {
	feedRef: React.RefObject<HTMLDivElement | null>;
	onScroll: () => void;
	isLoading: boolean;
	messages: Message[];
	user: User | null;
	isFetchingEarlier: boolean;
	isFriendTyping: boolean;
}

const MessageFeed: React.FC<MessageFeedProps> = ({
	feedRef,
	onScroll,
	isLoading,
	messages,
	user,
	isFetchingEarlier,
	isFriendTyping,
}) => {
	const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

	const handleMessageClick = (msgId: string) => {
		setSelectedMessageId((prev) => (prev === msgId ? null : msgId));
	};

	return (
		<div
			ref={feedRef}
			onScroll={onScroll}
			className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar"
		>
			{isLoading ? (
				<div className="h-full flex items-center justify-center">
					<div className="w-8 h-8 border-4 border-blue-50/30 border-t-blue-500 rounded-full animate-spin" />
				</div>
			) : messages.length === 0 ? (
				<div className="h-full flex flex-col items-center justify-center text-slate-500 select-none">
					<Smile size={40} className="mb-2 stroke-1" />
					<p className="text-sm">Say hello to your new friend!</p>
				</div>
			) : (
				<>
					{isFetchingEarlier && (
						<div className="flex justify-center py-2 select-none">
							<div className="w-5 h-5 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
						</div>
					)}
					{messages.map((msg) => {
						const isMe = msg.sender === user?.id;
						const timeStr = msg.createdAt
							? format(new Date(msg.createdAt), "h:mm a")
							: "";
						const isSelected = selectedMessageId === msg._id;
						return (
							<div
								key={msg._id}
								className={`flex items-end gap-1.5 ${isMe ? "justify-end" : "justify-start"}`}>
								
								{/* Status Indicator Tick (Delivered / Read) */}
								{isMe && (
									<span className="text-slate-500/80 shrink-0 mb-1 select-none">
										{msg.read ? (
											<CheckCheck size={14} className="text-blue-400" />
										) : (
											<Check size={14} />
										)}
									</span>
								)}

								<div
									onClick={() => handleMessageClick(msg._id)}
									className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm cursor-pointer select-none transition-all duration-200 ${
										isMe
											? "bg-blue-600 text-white rounded-br-none shadow-lg shadow-blue-600/15 active:bg-blue-700"
											: "bg-slate-800/80 text-slate-200 rounded-bl-none border border-slate-700/30 active:bg-slate-700/80"
									}`}>
									<p className="leading-relaxed wrap-break-word">{msg.content}</p>
									{isSelected && (
										<span
											className={`block text-[10px] mt-1 text-right select-none animate-in fade-in slide-in-from-top-1 duration-150 ${
												isMe ? "text-blue-200/90" : "text-slate-500"
											}`}>
											{timeStr}
										</span>
									)}
								</div>
							</div>
						);
					})}
				</>
			)}

			{/* Typing Indicator Bubble */}
			{isFriendTyping && (
				<div className="flex justify-start select-none">
					<div className="bg-slate-800/80 rounded-2xl rounded-bl-none px-4 py-3 border border-slate-700/30">
						<div className="flex items-center gap-1">
							<span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100" />
							<span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200" />
							<span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-300" />
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default MessageFeed;
