import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import conversationService from "../../services/conversationService";
import Modal from "../ui/Modal";

interface AddConversationModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const addConversationSchema = z.object({
	connectCode: z.string().min(1, "Connect code is required"),
});

type AddConversationSchema = z.infer<typeof addConversationSchema>;

const AddConversationModal: React.FC<AddConversationModalProps> = ({
	isOpen,
	onClose,
}) => {
	const queryClient = useQueryClient();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [debouncedCode, setDebouncedCode] = useState("");

	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm<AddConversationSchema>({
		resolver: zodResolver(addConversationSchema),
		defaultValues: {
			connectCode: "",
		},
	});

	const connectCodeValue = watch("connectCode");

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedCode(connectCodeValue || "");
		}, 300);
		return () => clearTimeout(handler);
	}, [connectCodeValue]);

	const { data: checkData, isLoading: isChecking, error: checkError } = useQuery({
		queryKey: ["checkConnectCode", debouncedCode],
		queryFn: () => conversationService.checkConnectCode(debouncedCode),
		enabled: debouncedCode.trim().length >= 6,
		retry: false,
	});

	const { mutate, isPending } = useMutation({
		mutationFn: (connectCode: string) =>
			conversationService.addConversation(connectCode),
		onSuccess: (data) => {
			toast.success(data.message || "Conversation added successfully!");
			queryClient.invalidateQueries({ queryKey: ["conversations"] });
			reset();
			setErrorMessage(null);
			setDebouncedCode("");
			onClose();
		},
		onError: (error: any) => {
			const msg =
				error?.response?.data?.message ||
				"Failed to add conversation. Please check the connect code.";
			setErrorMessage(msg);
		},
	});

	const onSubmit = (data: AddConversationSchema) => {
		setErrorMessage(null);
		mutate(data.connectCode);
	};

	const handleClose = () => {
		reset();
		setErrorMessage(null);
		setDebouncedCode("");
		onClose();
	};

	const isSubmitDisabled = isPending;

	return (
		<Modal isOpen={isOpen} onClose={handleClose} title="Add New Friend">
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div>
					<p className="text-sm text-slate-400 mb-4 leading-relaxed">
						Enter your friend's unique 6-digit connect code to establish a connection and start messaging.
					</p>
					<label
						htmlFor="connectCode"
						className="block text-sm font-medium text-slate-300 mb-1.5">
						Connect Code
					</label>
					<input
						id="connectCode"
						type="text"
						{...register("connectCode")}
						placeholder="e.g. 111111"
						disabled={isPending}
						className="block w-full px-3.5 py-2.5 bg-slate-800/40 border border-slate-700/50 text-slate-100 placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all duration-150"
					/>
					{errors.connectCode && (
						<p className="mt-1.5 text-xs text-red-400">
							{errors.connectCode.message}
						</p>
					)}
					{errorMessage && (
						<p className="mt-1.5 text-xs text-red-400 font-medium">
							{errorMessage}
						</p>
					)}

					{debouncedCode.trim().length >= 6 && (isChecking || checkError || checkData?.data) && (
						<div className="mt-3 p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl flex items-center justify-between transition-all duration-200">
							{isChecking ? (
								<div className="flex items-center gap-2 text-xs text-slate-400">
									<div className="w-4 h-4 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
									<span>Looking up connect code...</span>
								</div>
							) : checkError ? (
								<span className="text-xs text-rose-400 font-medium">
									{((checkError as any)?.response?.data?.message) || "User not found or already friends"}
								</span>
							) : checkData?.data ? (
								<div className="flex items-center justify-between w-full">
									<div className="flex items-center gap-3">
										<img
											src={`https://avatarapi.runflare.run/public?username=${checkData.data.username}`}
											alt={checkData.data.fullname}
											className="w-9 h-9 rounded-full object-cover border border-slate-700"
										/>
										<div className="text-left">
											<p className="text-sm font-semibold text-slate-200 leading-none">{checkData.data.fullname}</p>
											<p className="text-xs text-slate-500 mt-1.5">@{checkData.data.username}</p>
										</div>
									</div>
									<span className="text-xs font-semibold px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg">
										Found Profile
									</span>
								</div>
							) : null}
						</div>
					)}
				</div>

				<div className="flex justify-end gap-3 pt-2">
					<button
						type="button"
						onClick={handleClose}
						disabled={isPending}
						className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800/60 border border-slate-700/60 rounded-xl hover:bg-slate-700/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0f172a] focus:ring-blue-500 disabled:opacity-50 transition-colors duration-150">
						Cancel
					</button>
					<button
						type="submit"
						disabled={isSubmitDisabled}
						className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-xl hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0f172a] focus:ring-blue-500 disabled:opacity-50 transition-colors duration-150 min-w-[100px] shadow-lg shadow-blue-600/10">
						{isPending ? (
							<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
						) : (
							"Add Friend"
						)}
					</button>
				</div>
			</form>
		</Modal>
	);
};

export default AddConversationModal;
