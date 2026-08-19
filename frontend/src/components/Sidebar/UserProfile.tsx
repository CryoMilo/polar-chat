import React from "react";
import { LogOut, Copy } from "lucide-react";
import { useAuthStore } from "../../../stores/authStore";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import authService from "../../services/authService";

interface UserProfileProps {
	onProfileClick?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onProfileClick }) => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { user, logout } = useAuthStore();

	if (!user) {
		return null;
	}

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(user.connectCode);
			toast.success("Connect Code copied!");
		} catch (error) {
			console.log("Copy failed", error);
			toast.error("Failed to Copy");
		}
	};

	const onLogout = async () => {
		await authService.logout();
		logout();
		queryClient.removeQueries({ queryKey: ["auth"] });
		navigate("/auth");
		toast.success("Logout Successful");
	};

	return (
		<div className="p-4 border-t border-blue-50/10 bg-[#0b0f19] flex items-center justify-between">
			<div
				onClick={onProfileClick}
				className="flex items-center gap-3 min-w-0 cursor-pointer group select-none"
			>
				<div className="relative shrink-0">
					<img
						src={user.avatar || `https://avatarapi.runflare.run/public?username=${user.username}`}
						alt="User"
						className="size-10 rounded-full object-cover border border-slate-700 group-hover:border-blue-500 transition-all duration-200"
					/>
					<span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
				</div>
				<div className="min-w-0">
					<h4 className="text-sm font-semibold text-slate-200 truncate group-hover:text-blue-400 transition-all duration-200">
						{user.username}
					</h4>
					<div
						onClick={(e) => {
							e.stopPropagation();
							copyToClipboard();
						}}
						className="flex items-center gap-1 mt-0.5 text-xs text-slate-500 hover:text-slate-300"
					>
						<span>#{user.connectCode}</span>
						<Copy size={12} />
					</div>
				</div>
			</div>
			<button
				onClick={onLogout}
				title="Log out"
				className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-400 transition-colors duration-200">
				<LogOut size={18} />
			</button>
		</div>
	);
};

export default UserProfile;
