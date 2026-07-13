import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authService } from "../../../services/authService";

interface RegisterFormProps {
	onSwitch: () => void;
}

const registerSchema = z
	.object({
		fullName: z
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
		<div className="w-full max-w-md p-8 space-y-6">
			<div className="text-center">
				<h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
					Create Account
				</h2>
				<p className="mt-2 text-sm text-gray-600">
					Join us and start chatting today
				</p>
			</div>

			<form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
				<div>
					<label
						htmlFor="fullName"
						className="block text-sm font-medium text-gray-700">
						Full Name
					</label>
					<input
						id="fullName"
						type="text"
						{...register("fullName")}
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
						placeholder="John Doe"
					/>
					{errors.fullName && (
						<p className="text-red-500 text-xs mt-1">
							{errors.fullName.message}
						</p>
					)}
				</div>

				<div>
					<label
						htmlFor="username"
						className="block text-sm font-medium text-gray-700">
						Username
					</label>
					<input
						id="username"
						type="text"
						{...register("username")}
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
						placeholder="johndoe"
					/>
					{errors.username && (
						<p className="text-red-500 text-xs mt-1">
							{errors.username.message}
						</p>
					)}
				</div>

				<div>
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700">
						Email Address
					</label>
					<input
						id="email"
						type="email"
						{...register("email")}
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
						placeholder="you@example.com"
					/>
					{errors.email && (
						<p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
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
						type="password"
						{...register("password")}
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
						placeholder="••••••••"
					/>
					{errors.password && (
						<p className="text-red-500 text-xs mt-1">
							{errors.password.message}
						</p>
					)}
				</div>

				<div>
					<label
						htmlFor="confirmPassword"
						className="block text-sm font-medium text-gray-700">
						Confirm Password
					</label>
					<input
						id="confirmPassword"
						type="password"
						{...register("confirmPassword")}
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
						placeholder="••••••••"
					/>
					{errors.confirmPassword && (
						<p className="text-red-500 text-xs mt-1">
							{errors.confirmPassword.message}
						</p>
					)}
				</div>

				<div>
					<button
						type="submit"
						disabled={mutation.isPending}
						className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50">
						{mutation.isPending ? "Registering..." : "Register"}
					</button>
				</div>
			</form>

			<div className="text-center mt-4">
				<p className="text-sm text-gray-600">
					Already have an account?{" "}
					<button
						onClick={onSwitch}
						className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none">
						Sign in
					</button>
				</p>
			</div>
		</div>
	);
};

export default RegisterForm;
