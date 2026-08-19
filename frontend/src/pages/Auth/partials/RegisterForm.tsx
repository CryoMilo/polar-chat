import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import authService from "../../../services/authService.ts";

interface RegisterFormProps {
	onSwitch: () => void;
}

const registerSchema = z
	.object({
		fullname: z
			.string()
			.trim()
			.min(3, "Full name must be at least 3 characters")
			.max(40),
		username: z
			.string()
			.regex(
				/^[a-z0-9_]+$/,
				"Username can only contain lowercase letters, numbers and underscores"
			)
			.min(6, "Username too short")
			.max(26, "Username too long"),
		email: z.email("Invalid email address"),
		password: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitch }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
	});

	const mutation = useMutation({
		mutationFn: authService.register,
		onSuccess: () => {
			onSwitch();
			toast.success("Account Created Successfully");
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		onError: (err: any) => {
			const msg = err.response?.data?.message || "Registration Failed";
			toast.error(msg);
		},
	});

	const onSubmit = (data: RegisterFormData) => mutation.mutate(data);

	return (
		<div className="bg-[#0f172a]/40 backdrop-blur-md border border-slate-800/60 p-8 rounded-2xl shadow-2xl space-y-6 w-full">
			<div className="text-center">
				<h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">
					Create Account
				</h2>
				<p className="mt-2 text-sm text-slate-400">
					Join us and start chatting today
				</p>
			</div>

			<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
				<div>
					<label
						htmlFor="fullname"
						className="block text-sm font-medium text-slate-300 mb-1.5">
						Full Name
					</label>
					<input
						id="fullname"
						type="text"
						{...register("fullname")}
						className="block w-full px-3.5 py-2.5 bg-slate-800/40 border border-slate-700/50 text-slate-100 placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all duration-150"
						placeholder="John Doe"
					/>
					{errors.fullname && (
						<p className="text-red-500 text-xs mt-1.5">
							{errors.fullname.message}
						</p>
					)}
				</div>

				<div>
					<label
						htmlFor="username"
						className="block text-sm font-medium text-slate-300 mb-1.5">
						Username
					</label>
					<input
						id="username"
						type="text"
						{...register("username")}
						className="block w-full px-3.5 py-2.5 bg-slate-800/40 border border-slate-700/50 text-slate-100 placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all duration-150"
						placeholder="johndoe"
					/>
					{errors.username && (
						<p className="text-red-500 text-xs mt-1.5">
							{errors.username.message}
						</p>
					)}
				</div>

				<div>
					<label
						htmlFor="email"
						className="block text-sm font-medium text-slate-300 mb-1.5">
						Email Address
					</label>
					<input
						id="email"
						type="email"
						{...register("email")}
						className="block w-full px-3.5 py-2.5 bg-slate-800/40 border border-slate-700/50 text-slate-100 placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all duration-150"
						placeholder="you@example.com"
					/>
					{errors.email && (
						<p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>
					)}
				</div>

				<div>
					<label
						htmlFor="password"
						className="block text-sm font-medium text-slate-300 mb-1.5">
						Password
					</label>
					<input
						id="password"
						type="password"
						{...register("password")}
						className="block w-full px-3.5 py-2.5 bg-slate-800/40 border border-slate-700/50 text-slate-100 placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all duration-150"
						placeholder="••••••••"
					/>
					{errors.password && (
						<p className="text-red-500 text-xs mt-1.5">
							{errors.password.message}
						</p>
					)}
				</div>

				<div>
					<label
						htmlFor="confirmPassword"
						className="block text-sm font-medium text-slate-300 mb-1.5">
						Confirm Password
					</label>
					<input
						id="confirmPassword"
						type="password"
						{...register("confirmPassword")}
						className="block w-full px-3.5 py-2.5 bg-slate-800/40 border border-slate-700/50 text-slate-100 placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all duration-150"
						placeholder="••••••••"
					/>
					{errors.confirmPassword && (
						<p className="text-red-500 text-xs mt-1.5">
							{errors.confirmPassword.message}
						</p>
					)}
				</div>

				<div className="pt-2">
					<button
						type="submit"
						disabled={mutation.isPending}
						className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0b0f19] focus:ring-blue-500 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 transition-all duration-200">
						{mutation.isPending ? "Registering..." : "Register"}
					</button>
				</div>
			</form>

			<div className="text-center mt-4">
				<p className="text-sm text-slate-400">
					Already have an account?{" "}
					<button
						onClick={onSwitch}
						className="font-semibold text-blue-400 hover:text-blue-300 focus:outline-none transition-colors duration-150">
						Sign in
					</button>
				</p>
			</div>
		</div>
	);
};

export default RegisterForm;
