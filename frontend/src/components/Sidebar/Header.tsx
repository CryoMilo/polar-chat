import React from "react";
import { MessageSquarePlus, Settings, MessageSquareCode } from "lucide-react";

const Header: React.FC = () => {
	return (
		<div className="flex items-center justify-between p-4 border-b border-blue-50/10 bg-[#0f172a] text-white">
			<div className="flex items-center gap-2">
				<div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/20">
					<MessageSquareCode size={20} />
				</div>
				<h1 className="text-xl font-bold tracking-tight bg-linear-to-r from-blue-400 to-indigo-200 bg-clip-text text-transparent">
					Polar Chat
				</h1>
			</div>
			<div className="flex items-center gap-3">
				<button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors duration-200">
					<MessageSquarePlus size={20} />
				</button>
				<button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors duration-200">
					<Settings size={20} />
				</button>
			</div>
		</div>
	);
};

export default Header;
