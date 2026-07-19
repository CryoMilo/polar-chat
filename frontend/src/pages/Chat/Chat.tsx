import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import ChatWindow from "../../components/ChatWindow/ChatWindow";
import ChatPlaceholder from "../../components/ChatWindow/ChatPlaceholder";

const Chat: React.FC = () => {
	// Simulating state for display purposes (set to true to show the active chat, false to show placeholder)
	const hasSelectedChat = true;

	return (
		<div className="flex h-screen w-screen overflow-hidden bg-[#0b0f19]">
			{/* Left section: Sidebar */}
			<div className="hidden md:block">
				<Sidebar />
			</div>

			{/* On mobile devices: Show/Hide based on selection */}
			<div className="md:hidden shrink-0">
				<Sidebar />
			</div>

			{/* Right section: Chat Feed Window */}
			<main className="flex-1 h-full flex flex-col min-w-0">
				{hasSelectedChat ? <ChatWindow /> : <ChatPlaceholder />}
			</main>
		</div>
	);
};

export default Chat;
