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
			setUser(data);
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
		<div className="w-full max-w-md p-8 space-y-6">
			<div className="text-center">
				<h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
					Welcome Back
				</h2>
				<p className="mt-2 text-sm text-gray-600">
					Please enter your details to sign in
				</p>
			</div>
			<form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
				<div>
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700">
						Email Address
					</label>
					<input
						id="email"
						{...register("email")}
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
						placeholder="you@example.com"
					/>
					{errors.email && (
						<p className="text-red-400 text-sm">{errors.email.message}</p>
					)}
				</div>
				<div>
					<label
						htmlFor="password"
						className="block text-sm font-medium text-gray-700">
						Password
					</label>
					<input
						id="password"
						{...register("password")}
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
						placeholder="••••••••"
					/>
					{errors.password && (
						<p className="text-red-400 text-sm">{errors.password.message}</p>
					)}
				</div>
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<input
							id="remember-me"
							name="remember-me"
							type="checkbox"
							className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
						/>
						<label
							htmlFor="remember-me"
							className="ml-2 block text-sm text-gray-900">
							Remember me
						</label>
					</div>
					<div className="text-sm">
						<a
							href="#"
							className="font-medium text-blue-600 hover:text-blue-500">
							Forgot your password?
						</a>
					</div>
				</div>
				<div>
					<button
						type="submit"
						className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out">
						Sign In
					</button>
				</div>
			</form>
			<div className="text-center mt-4">
				<p className="text-sm text-gray-600">
					Don't have an account?{" "}
					<button
						onClick={onSwitch}
						className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none">
						Sign up
					</button>
				</p>
			</div>
		</div>
	);
};

export default LoginForm;
