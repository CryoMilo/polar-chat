import React from "react";
import Header from "./Header";
import SearchBar from "./SearchBar";
import Conversations from "./Conversations";
import UserProfile from "./UserProfile";

const Sidebar: React.FC = () => {
	return (
		<aside className="w-full md:w-80 lg:w-96 h-full flex flex-col border-r border-blue-50/10 bg-[#0f172a] shadow-xl">
			{/* Sidebar Header */}
			<Header />

			{/* Search / Friend query bar */}
			<SearchBar />

			{/* List of conversation items */}
			<Conversations />

			{/* User footer profile section */}
			<UserProfile />
		</aside>
	);
};

export default Sidebar;
