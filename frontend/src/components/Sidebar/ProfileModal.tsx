import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Camera, Trash2 } from "lucide-react";
import { useAuthStore } from "../../../stores/authStore";
import authService from "../../services/authService";
import Modal from "../ui/Modal";

interface ProfileModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const profileSchema = z.object({
	fullname: z
		.string()
		.min(6, "Fullname must be at least 6 characters")
		.max(20, "Fullname must be at most 20 characters"),
	username: z
		.string()
		.min(6, "Username must be at least 6 characters")
		.max(20, "Username must be at most 20 characters")
		.regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
});

type ProfileSchema = z.infer<typeof profileSchema>;

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
	const queryClient = useQueryClient();
	const { user, setUser } = useAuthStore();
	const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { errors },
	} = useForm<ProfileSchema>({
		resolver: zodResolver(profileSchema),
	});

	// Populate form fields with current user data on open
	useEffect(() => {
		if (isOpen && user) {
			setValue("fullname", user.fullname);
			setValue("username", user.username);
			setAvatarBase64(user.avatar || null);
		}
	}, [isOpen, user, setValue]);

	const { mutate: updateProfile, isPending } = useMutation({
		mutationFn: (data: { fullname: string; username: string; avatar: string | null }) =>
			authService.updateProfile(data),
		onSuccess: (response) => {
			toast.success("Profile updated successfully!");
			if (response.user) {
				setUser(response.user);
			}
			queryClient.invalidateQueries({ queryKey: ["conversations"] });
			onClose();
		},
		onError: (error: any) => {
			const errMsg =
				error?.response?.data?.message || "Failed to update profile. Please try again.";
			toast.error(errMsg);
		},
	});

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// 1MB Size Limit
		if (file.size > 1024 * 1024) {
			toast.error("Image size must be smaller than 1MB");
			return;
		}

		const reader = new FileReader();
		reader.onloadend = () => {
			setAvatarBase64(reader.result as string);
		};
		reader.readAsDataURL(file);
	};

	const handleRemoveAvatar = () => {
		setAvatarBase64(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const onSubmit = (data: ProfileSchema) => {
		updateProfile({
			fullname: data.fullname,
			username: data.username,
			avatar: avatarBase64,
		});
	};

	const handleClose = () => {
		reset();
		onClose();
	};

	if (!user) return null;

	const currentAvatarSrc =
		avatarBase64 || `https://avatarapi.runflare.run/public?username=${user.username}`;

	return (
		<Modal isOpen={isOpen} onClose={handleClose} title="Edit Profile">
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{/* Avatar Upload Section */}
				<div className="flex flex-col items-center gap-3">
					<div className="relative group size-24 rounded-full overflow-hidden border border-slate-700 bg-slate-900 flex items-center justify-center">
						<img
							src={currentAvatarSrc}
							alt="Profile Avatar"
							className="size-full object-cover group-hover:opacity-40 transition-opacity duration-200"
						/>
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40 cursor-pointer"
						>
							<Camera size={20} />
							<span className="text-[10px] font-medium">Upload</span>
						</button>
					</div>

					<input
						type="file"
						ref={fileInputRef}
						onChange={handleImageChange}
						accept="image/png, image/jpeg, image/jpg, image/webp"
						className="hidden"
					/>

					{avatarBase64 && (
						<button
							type="button"
							onClick={handleRemoveAvatar}
							className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-medium transition-colors duration-150"
						>
							<Trash2 size={12} />
							<span>Remove Photo</span>
						</button>
					)}
				</div>

				{/* Inputs Section */}
				<div className="space-y-4">
					<div>
						<label
							htmlFor="fullname"
							className="block text-sm font-medium text-slate-300 mb-1.5"
						>
							Full Name
						</label>
						<input
							id="fullname"
							type="text"
							{...register("fullname")}
							disabled={isPending}
							className="block w-full px-3.5 py-2.5 bg-slate-800/40 border border-slate-700/50 text-slate-100 placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all duration-150"
						/>
						{errors.fullname && (
							<p className="mt-1.5 text-xs text-red-400">
								{errors.fullname.message}
							</p>
						)}
					</div>

					<div>
						<label
							htmlFor="username"
							className="block text-sm font-medium text-slate-300 mb-1.5"
						>
							Username
						</label>
						<input
							id="username"
							type="text"
							{...register("username")}
							disabled={isPending}
							className="block w-full px-3.5 py-2.5 bg-slate-800/40 border border-slate-700/50 text-slate-100 placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all duration-150"
						/>
						{errors.username && (
							<p className="mt-1.5 text-xs text-red-400">
								{errors.username.message}
							</p>
						)}
					</div>
				</div>

				{/* Buttons Section */}
				<div className="flex justify-end gap-3 pt-2">
					<button
						type="button"
						onClick={handleClose}
						disabled={isPending}
						className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800/60 border border-slate-700/60 rounded-xl hover:bg-slate-700/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0f172a] focus:ring-blue-500 disabled:opacity-50 transition-colors duration-150"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={isPending}
						className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-xl hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0f172a] focus:ring-blue-500 disabled:opacity-50 transition-colors duration-150 min-w-[100px] shadow-lg shadow-blue-600/10"
					>
						{isPending ? (
							<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
						) : (
							"Save Changes"
						)}
					</button>
				</div>
			</form>
		</Modal>
	);
};

export default ProfileModal;
