import React from "react";
import { Paperclip, Image, Smile, Send } from "lucide-react";

interface MessageInputProps {
	inputRef: React.RefObject<HTMLInputElement | null>;
	inputText: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onSubmit: (e: React.FormEvent) => void;
	isSending: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
	inputRef,
	inputText,
	onChange,
	onSubmit,
	isSending,
}) => {
	return (
		<div className="p-4 border-t border-blue-50/10 bg-[#0f172a]">
			<form
				className="flex items-center gap-2"
				onSubmit={onSubmit}>
				<button
					type="button"
					className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors duration-200">
					<Paperclip size={20} />
				</button>
				<button
					type="button"
					className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors duration-200">
					<Image size={20} />
				</button>
				<button
					type="button"
					className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors duration-200">
					<Smile size={20} />
				</button>
				<input
					ref={inputRef}
					type="text"
					value={inputText}
					onChange={onChange}
					placeholder="Type a message..."
					disabled={isSending}
					className="flex-1 bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
				/>
				<button
					type="submit"
					disabled={isSending || !inputText.trim()}
					className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/10 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:active:scale-100">
					<Send size={20} />
				</button>
			</form>
		</div>
	);
};

export default MessageInput;
