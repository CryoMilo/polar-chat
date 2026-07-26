import type { Conversation } from "../../contexts/ConversationsContext";
import { formatDistanceToNowStrict, parseISO } from "date-fns";

interface ConversationItemProps {
	chat: Conversation;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ chat }) => {
	const shortLocale = {
		formatDistance: (token: string, count: number) => {
			const units: Record<string, string> = {
				xSeconds: `${count}s`,
				xMinutes: `${count}m`,
				xHours: `${count}h`,
				xDays: `${count}d`,
				xMonths: `${count}m`,
				xYears: `${count}y`,
			};
			return units[token] ?? `${count}s`;
		},
	};

	const lastMsg = new Date(chat.lastMessage.timestamp);

	const diffInMiutes = formatDistanceToNowStrict(lastMsg, {
		addSuffix: false,
		locale: shortLocale,
	});

	return (
		<div
			key={chat.conversationId}
			className="flex items-center gap-3 p-3 my-1 rounded-xl cursor-pointer hover:bg-slate-800/40 active:bg-slate-800/60 transition-all duration-200">
			<div className="relative shrink-0">
				<img
					src="https://picsum.photos/200?random=1"
					alt={chat.friend.fullname}
					className="w-12 h-12 rounded-full object-cover border border-slate-700/50"
				/>
				{chat.friend.online && (
					<span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
				)}
			</div>
			<div className="flex-1 min-w-0">
				<div className="flex items-center justify-between">
					<h3 className="text-sm font-semibold text-slate-200 truncate">
						{chat.friend.fullname}
					</h3>
					<span className="text-xs text-slate-500 whitespace-nowrap">
						{diffInMiutes}
					</span>
				</div>
				<div className="flex items-center justify-between mt-1">
					<p className="text-xs text-slate-400 truncate pr-4">
						{chat.lastMessage.content}
					</p>
					{/* {chat.unreadCounts > 0 && (
						<span className="flex items-center justify-center min-w-5 h-5 px-1.5 text-[10px] font-bold text-white bg-blue-600 rounded-full">
							{chat.unread}
						</span>
					)} */}
				</div>
			</div>
		</div>
	);
};

export default ConversationItem;
