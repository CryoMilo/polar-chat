import React from "react";
import { Search } from "lucide-react";

const SearchBar: React.FC = () => {
	return (
		<div className="p-4 bg-[#0f172a]">
			<div className="relative">
				<Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
				<input
					type="text"
					placeholder="Search conversations..."
					className="w-full pl-10 pr-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
				/>
			</div>
		</div>
	);
};

export default SearchBar;
