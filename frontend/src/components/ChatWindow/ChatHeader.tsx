import React from "react";
import { ArrowLeft, Phone, Video, MoreVertical } from "lucide-react";
import type { User } from "../../../stores/authStore";

interface ChatHeaderProps {
	friend: User & { online: boolean };
	isFriendTyping: boolean;
	onBack: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
	friend,
	isFriendTyping,
	onBack,
}) => {
	return (
		<div className="flex items-center justify-between p-4 border-b border-blue-50/10 bg-[#0f172a] text-white select-none">
			<div className="flex items-center gap-3">
				{/* Back Button (Mobile Only) */}
				<button
					onClick={onBack}
					className="md:hidden p-2 -ml-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors duration-200"
				>
					<ArrowLeft size={20} />
				</button>

				<div className="relative">
					<img
						src={friend.avatar || `https://avatarapi.runflare.run/public?username=${friend.username}`}
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
						{isFriendTyping ? (
							<span className="text-blue-400 font-medium animate-pulse">typing...</span>
						) : (
							friend.online ? "online" : "offline"
						)}
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
	);
};

export default ChatHeader;
