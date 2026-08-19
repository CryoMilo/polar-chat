import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<AddConversationSchema>({
		resolver: zodResolver(addConversationSchema),
		defaultValues: {
			connectCode: "",
		},
	});

	const { mutate, isPending } = useMutation({
		mutationFn: (connectCode: string) =>
			conversationService.addConversation(connectCode),
		onSuccess: (data) => {
			toast.success(data.message || "Conversation added successfully!");
			queryClient.invalidateQueries({ queryKey: ["conversations"] });
			reset();
			setErrorMessage(null);
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
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose} title="Add New Friend">
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div>
					<p className="text-sm text-gray-500 mb-4 leading-relaxed">
						Enter your friend's unique 6-digit connect code to establish a connection and start messaging.
					</p>
					<label
						htmlFor="connectCode"
						className="block text-sm font-medium text-gray-700">
						Connect Code
					</label>
					<input
						id="connectCode"
						type="text"
						{...register("connectCode")}
						placeholder="e.g. 111111"
						disabled={isPending}
						className="mt-1.5 block w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 sm:text-sm transition-all duration-150"
					/>
					{errors.connectCode && (
						<p className="mt-1.5 text-xs text-red-500">
							{errors.connectCode.message}
						</p>
					)}
					{errorMessage && (
						<p className="mt-1.5 text-xs text-red-500 font-medium">
							{errorMessage}
						</p>
					)}
				</div>

				<div className="flex justify-end gap-3 pt-2">
					<button
						type="button"
						onClick={handleClose}
						disabled={isPending}
						className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-150">
						Cancel
					</button>
					<button
						type="submit"
						disabled={isPending}
						className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-150 min-w-[100px]">
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
