import React, { useState } from "react";
import Header from "./Header";
import SearchBar from "./SearchBar";
import Conversations from "./Conversations";
import UserProfile from "./UserProfile";
import AddConversationModal from "./AddConversationModal";

const Sidebar: React.FC = () => {
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	return (
		<aside className="w-full md:w-80 lg:w-96 h-full flex flex-col border-r border-blue-50/10 bg-[#0f172a] shadow-xl">
			<Header onAddClick={() => setIsAddModalOpen(true)} />

			<SearchBar />
			<Conversations />

			<UserProfile />

			<AddConversationModal
				isOpen={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
			/>
		</aside>
	);
};

export default Sidebar;
