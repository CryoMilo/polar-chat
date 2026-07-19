import React from "react";
import { LogOut, Copy } from "lucide-react";
import { useAuthStore } from "../../../stores/authStore";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import authService from "../../services/authService";

const UserProfile: React.FC = () => {
	const navigate = useNavigate();
	const { user, logout } = useAuthStore();

	const mutation = useMutation({
		mutationFn: authService.logout,
		onSuccess: () => {
			toast.success("Logout Successful");
			navigate("/auth");
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		onError: (err: any) => {
			const msg = err.response?.data?.message || "Logout Failed";
			toast.error(msg);
		},
	});

	const onLogout = () => {
		mutation.mutate();
		logout();
	};

	if (!user) {
		return null;
	}

	return (
		<div className="p-4 border-t border-blue-50/10 bg-[#0b0f19] flex items-center justify-between">
			<div className="flex items-center gap-3 min-w-0">
				<div className="relative shrink-0">
					<img
						src="https://avatar.iran.liara.run/public"
						alt="User"
						className="size-10 rounded-full object-cover border border-slate-700"
					/>
					<span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
				</div>
				<div className="min-w-0">
					<h4 className="text-sm font-semibold text-slate-200 truncate">
						{user.username}
					</h4>
					<div className="flex items-center gap-1 mt-0.5 text-xs text-slate-500 cursor-pointer hover:text-slate-300">
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
