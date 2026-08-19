import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import ChatWindow from "../../components/ChatWindow/ChatWindow";
import ChatPlaceholder from "../../components/ChatWindow/ChatPlaceholder";
import { SocketProvider } from "../../contexts/SocketContext";
import { MobileChatProvider, useMobileChat } from "../../contexts/MobileChatContext";

import { useConversationContext } from "../../contexts/ConversationsContext";

import { ConversationProvider } from "../../contexts/ConversationsContext";

const ChatContent: React.FC = () => {
	const { isMobileChatOpen } = useMobileChat();
	const { activeConversation } = useConversationContext();
	const hasSelectedChat = !!activeConversation;

	return (
		<div className="flex h-screen w-screen overflow-hidden bg-[#0b0f19]">
			{/* Left section: Sidebar (always visible on desktop, hidden on mobile if a chat is active) */}
			<div className={`md:block h-full ${isMobileChatOpen ? "hidden" : "w-full md:w-80 lg:w-96 shrink-0"}`}>
				<Sidebar />
			</div>

			{/* Right section: Chat Feed Window (always visible on desktop, hidden on mobile if no chat is active) */}
			<main className={`flex-1 h-full flex flex-col min-w-0 ${!isMobileChatOpen ? "hidden md:flex" : "flex"}`}>
				{hasSelectedChat ? <ChatWindow /> : <ChatPlaceholder />}
			</main>
		</div>
	);
};

const Chat: React.FC = () => {
	return (
		<MobileChatProvider>
			<SocketProvider>
				<ConversationProvider>
					<ChatContent />
				</ConversationProvider>
			</SocketProvider>
		</MobileChatProvider>
	);
};

export default Chat;
