import React from "react";
import Header from "./Header";
import SearchBar from "./SearchBar";
import Conversations from "./Conversations";
import UserProfile from "./UserProfile";
import { ConversationProvider } from "../../contexts/ConversationsContext";

const Sidebar: React.FC = () => {
	return (
		<aside className="w-full md:w-80 lg:w-96 h-full flex flex-col border-r border-blue-50/10 bg-[#0f172a] shadow-xl">
			<Header />

			<ConversationProvider>
				<SearchBar />
				<Conversations />
			</ConversationProvider>

			<UserProfile />
		</aside>
	);
};

export default Sidebar;
