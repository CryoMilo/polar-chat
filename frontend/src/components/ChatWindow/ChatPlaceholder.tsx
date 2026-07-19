import React from "react";
import { MessageSquareDashed } from "lucide-react";

const ChatPlaceholder: React.FC = () => {
	return (
		<div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#0b0f19] text-center select-none">
			<div className="bg-blue-600/10 p-6 rounded-3xl text-blue-500 mb-6 animate-pulse">
				<MessageSquareDashed size={48} />
			</div>
			<h2 className="text-2xl font-bold text-slate-100 tracking-tight">
				Your Conversations
			</h2>
			<p className="mt-2 text-sm text-slate-400 max-w-md leading-relaxed">
				Select a contact from the sidebar or share your connect code to start chatting in real-time.
			</p>
			<div className="mt-8 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 text-xs font-semibold text-blue-400">
				End-to-End Encrypted
			</div>
		</div>
	);
};

export default ChatPlaceholder;
