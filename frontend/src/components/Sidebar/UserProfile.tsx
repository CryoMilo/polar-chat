import React from "react";
import { LogOut, Copy, User } from "lucide-react";

const UserProfile: React.FC = () => {
	const mockUser = {
		fullName: "David Aung",
		username: "davidaung",
		email: "david@polar.chat",
		avatar: "",
		connectCode: "948210",
	};

	return (
		<div className="p-4 border-t border-blue-50/10 bg-[#0b0f19] flex items-center justify-between">
			<div className="flex items-center gap-3 min-w-0">
				<div className="relative flex-shrink-0">
					{mockUser.avatar ? (
						<img
							src={mockUser.avatar}
							alt={mockUser.fullName}
							className="w-10 h-10 rounded-full object-cover border border-slate-700"
						/>
					) : (
						<div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold">
							<User size={20} />
						</div>
					)}
					<span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
				</div>
				<div className="min-w-0">
					<h4 className="text-sm font-semibold text-slate-200 truncate">
						{mockUser.fullName}
					</h4>
					<div className="flex items-center gap-1 mt-0.5 text-xs text-slate-500 cursor-pointer hover:text-slate-300">
						<span>#{mockUser.connectCode}</span>
						<Copy size={12} />
					</div>
				</div>
			</div>
			<button
				title="Log out"
				className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-400 transition-colors duration-200"
			>
				<LogOut size={18} />
			</button>
		</div>
	);
};

export default UserProfile;
