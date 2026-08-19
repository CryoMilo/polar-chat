import React, { useState } from "react";
import Header from "./Header";
import SearchBar from "./SearchBar";
import Conversations from "./Conversations";
import UserProfile from "./UserProfile";
import AddConversationModal from "./AddConversationModal";
import ProfileModal from "./ProfileModal";

const Sidebar: React.FC = () => {
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

	return (
		<aside className="w-full md:w-80 lg:w-96 h-full flex flex-col border-r border-blue-50/10 bg-[#0f172a] shadow-xl">
			<Header
				onAddClick={() => setIsAddModalOpen(true)}
				onSettingsClick={() => setIsProfileModalOpen(true)}
			/>

			<SearchBar />
			<Conversations />

			<UserProfile onProfileClick={() => setIsProfileModalOpen(true)} />

			<AddConversationModal
				isOpen={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
			/>

			<ProfileModal
				isOpen={isProfileModalOpen}
				onClose={() => setIsProfileModalOpen(false)}
			/>
		</aside>
	);
};

export default Sidebar;
