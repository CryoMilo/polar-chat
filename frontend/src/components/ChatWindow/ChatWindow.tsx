import React from "react";
import { Send, Image, Smile, Phone, Video, MoreVertical, Paperclip } from "lucide-react";

// Mock data representing a conversation's messages
const MOCK_MESSAGES = [
	{
		id: "1",
		senderId: "friend",
		text: "Hey! Did you check out the new design system?",
		timestamp: "10:30 AM",
	},
	{
		id: "2",
		senderId: "me",
		text: "Yeah, it looks clean. The dark mode color palette is perfect.",
		timestamp: "10:32 AM",
	},
	{
		id: "3",
		senderId: "friend",
		text: "Awesome! Let's implement it in the React frontend today.",
		timestamp: "10:33 AM",
	},
	{
		id: "4",
		senderId: "me",
		text: "Sure, let's coordinate. I will write the components.",
		timestamp: "10:35 AM",
	},
];

const ChatWindow: React.FC = () => {
	const activeContact = {
		name: "Alice Johnson",
		avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
		isOnline: true,
		isTyping: true,
	};

	return (
		<div className="flex-1 flex flex-col h-full bg-[#0b0f19]">
			{/* Chat Header */}
			<div className="flex items-center justify-between p-4 border-b border-blue-50/10 bg-[#0f172a] text-white">
				<div className="flex items-center gap-3">
					<div className="relative">
						<img
							src={activeContact.avatar}
							alt={activeContact.name}
							className="w-10 h-10 rounded-full object-cover border border-slate-700"
						/>
						{activeContact.isOnline && (
							<span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
						)}
					</div>
					<div>
						<h3 className="text-sm font-semibold text-slate-200">{activeContact.name}</h3>
						<span className="text-xs text-slate-500">
							{activeContact.isTyping ? "typing..." : "online"}
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
				{MOCK_MESSAGES.map((msg) => {
					const isMe = msg.senderId === "me";
					return (
						<div
							key={msg.id}
							className={`flex ${isMe ? "justify-end" : "justify-start"}`}
						>
							<div
								className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
									isMe
										? "bg-blue-600 text-white rounded-br-none shadow-lg shadow-blue-600/15"
										: "bg-slate-800/80 text-slate-200 rounded-bl-none border border-slate-700/30"
								}`}
							>
								<p className="leading-relaxed break-words">{msg.text}</p>
								<span
									className={`block text-[10px] mt-1 text-right ${
										isMe ? "text-blue-200" : "text-slate-500"
									}`}
								>
									{msg.timestamp}
								</span>
							</div>
						</div>
					);
				})}

				{/* Typing Indicator */}
				{activeContact.isTyping && (
					<div className="flex justify-start">
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

			{/* Message Input Section */}
			<div className="p-4 border-t border-blue-50/10 bg-[#0f172a]">
				<form className="flex items-center gap-2" onSubmit={(e) => e.preventDefault()}>
					<button
						type="button"
						className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors duration-200"
					>
						<Paperclip size={20} />
					</button>
					<button
						type="button"
						className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors duration-200"
					>
						<Image size={20} />
					</button>
					<button
						type="button"
						className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors duration-200"
					>
						<Smile size={20} />
					</button>
					<input
						type="text"
						placeholder="Type a message..."
						className="flex-1 bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
					/>
					<button
						type="submit"
						className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/10 active:scale-95 transition-all duration-200"
					>
						<Send size={20} />
					</button>
				</form>
			</div>
		</div>
	);
};

export default ChatWindow;
