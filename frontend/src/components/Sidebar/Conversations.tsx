import React from "react";

// Mock data representing conversations
const MOCK_CONVERSATIONS = [
	{
		id: "1",
		name: "Alice Johnson",
		avatar:
			"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
		isOnline: true,
		lastMessage: "Are we still meeting today at 5 PM?",
		time: "2m ago",
		unread: 2,
	},
	{
		id: "2",
		name: "Robert Smith",
		avatar:
			"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
		isOnline: false,
		lastMessage: "I uploaded the assets to the shared drive.",
		time: "1h ago",
		unread: 0,
	},
	{
		id: "3",
		name: "Emily Davis",
		avatar:
			"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
		isOnline: true,
		lastMessage: "Haha that's amazing! 😂 Let me know.",
		time: "3h ago",
		unread: 0,
	},
	{
		id: "4",
		name: "Alex Martinez",
		avatar:
			"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
		isOnline: true,
		lastMessage: "Can you review the PR?",
		time: "Yesterday",
		unread: 1,
	},
	{
		id: "5",
		name: "Sophia Chen",
		avatar:
			"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
		isOnline: false,
		lastMessage: "Thank you for the guidance!",
		time: "2 days ago",
		unread: 0,
	},
];

const Conversations: React.FC = () => {
	return (
		<div className="flex-1 overflow-y-auto divide-y divide-slate-800/40 bg-[#0f172a] px-2 py-1 select-none">
			{MOCK_CONVERSATIONS.map((chat) => (
				<div
					key={chat.id}
					className="flex items-center gap-3 p-3 my-1 rounded-xl cursor-pointer hover:bg-slate-800/40 active:bg-slate-800/60 transition-all duration-200">
					<div className="relative shrink-0">
						<img
							src={chat.avatar}
							alt={chat.name}
							className="w-12 h-12 rounded-full object-cover border border-slate-700/50"
						/>
						{chat.isOnline && (
							<span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
						)}
					</div>
					<div className="flex-1 min-w-0">
						<div className="flex items-center justify-between">
							<h3 className="text-sm font-semibold text-slate-200 truncate">
								{chat.name}
							</h3>
							<span className="text-xs text-slate-500 whitespace-nowrap">
								{chat.time}
							</span>
						</div>
						<div className="flex items-center justify-between mt-1">
							<p className="text-xs text-slate-400 truncate pr-4">
								{chat.lastMessage}
							</p>
							{chat.unread > 0 && (
								<span className="flex items-center justify-center min-w-5 h-5 px-1.5 text-[10px] font-bold text-white bg-blue-600 rounded-full">
									{chat.unread}
								</span>
							)}
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default Conversations;
