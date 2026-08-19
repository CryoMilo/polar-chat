import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import authService from "../../../services/authService.ts";
import { toast } from "sonner";
import { useAuthStore } from "../../../../stores/authStore";
import { useNavigate } from "react-router";

interface LoginFormProps {
	onSwitch: () => void;
}

const loginSchema = z.object({
	email: z.email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC<LoginFormProps> = ({ onSwitch }) => {
	const navigate = useNavigate();
	const { setUser } = useAuthStore();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(loginSchema),
	});

	const mutation = useMutation({
		mutationFn: authService.login,
		onSuccess: (data) => {
			setUser(data.user);
			toast.success("Login Successful");
			navigate("/");
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		onError: (err: any) => {
			const msg = err.response?.data?.message || "Login Failed";
			toast.error(msg);
		},
	});

	const onSubmit = (data: LoginFormData) => mutation.mutate(data);

	return (
		<div className="bg-[#0f172a]/40 backdrop-blur-md border border-slate-800/60 p-8 rounded-2xl shadow-2xl space-y-6">
			<div className="text-center">
				<h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">
					Welcome Back
				</h2>
				<p className="mt-2 text-sm text-slate-400">
					Please enter your details to sign in
				</p>
			</div>
			<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
						<p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>
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
						<p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>
					)}
				</div>
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<input
							id="remember-me"
							name="remember-me"
							type="checkbox"
							className="h-4 w-4 text-blue-600 focus:ring-blue-500/30 border-slate-700 rounded bg-slate-800"
						/>
						<label
							htmlFor="remember-me"
							className="ml-2 block text-sm text-slate-400">
							Remember me
						</label>
					</div>
					<div className="text-sm">
						<a
							href="#"
							className="font-medium text-blue-400 hover:text-blue-300 transition-colors duration-150">
							Forgot your password?
						</a>
					</div>
				</div>
				<div>
					<button
						type="submit"
						disabled={mutation.isPending}
						className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0b0f19] focus:ring-blue-500 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 transition-all duration-200">
						{mutation.isPending ? "Signing In..." : "Sign In"}
					</button>
				</div>
			</form>
			<div className="text-center mt-4">
				<p className="text-sm text-slate-400">
					Don't have an account?{" "}
					<button
						onClick={onSwitch}
						className="font-semibold text-blue-400 hover:text-blue-300 focus:outline-none transition-colors duration-150">
						Sign up
					</button>
				</p>
			</div>
		</div>
	);
};

export default LoginForm;
