import type { Conversation } from "../../contexts/ConversationsContext";
import { formatDistanceToNowStrict } from "date-fns";
import { shortLocale } from "../../utils/dates";
import { useAuthStore } from "../../../stores/authStore";
import { useMobileChat } from "../../contexts/MobileChatContext";

const ConversationItem: React.FC<Conversation> = ({
	conversationId,
	friend,
	lastMessage,
	unreadCounts,
}) => {
	const lastMsg = new Date(lastMessage.timestamp);
	const { user } = useAuthStore();
	const { setIsMobileChatOpen } = useMobileChat();

	const diffInTime = formatDistanceToNowStrict(lastMsg, {
		addSuffix: false,
		locale: shortLocale,
	});

	return (
		<div
			key={conversationId}
			onClick={() => setIsMobileChatOpen(true)}
			className="flex items-center gap-3 p-3 my-1 rounded-xl cursor-pointer hover:bg-slate-800/40 active:bg-slate-800/60 transition-all duration-200">
			<div className="relative shrink-0">
				<img
					src={`https://avatarapi.runflare.run/public?usearname=${friend.username}`}
					alt={friend.fullname}
					className="w-12 h-12 rounded-full object-cover border border-slate-700/50"
				/>
				{friend.online ? (
					<span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
				) : (
					<span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-gray-400 ring-2 ring-slate-900" />
				)}
			</div>
			<div className="flex-1 min-w-0">
				<div className="flex items-center justify-between">
					<h3 className="text-sm font-semibold text-slate-200 truncate">
						{friend.fullname}
					</h3>
					<span className="text-xs text-slate-500 whitespace-nowrap">
						{diffInTime}
					</span>
				</div>
				<div className="flex items-center justify-between mt-1">
					<p className="text-xs text-slate-400 truncate pr-4">
						{lastMessage.content}
					</p>
					{user && unreadCounts[user.id] > 0 && (
						<span className="flex items-center justify-center min-w-5 h-5 px-1.5 text-[10px] font-bold text-white bg-blue-600 rounded-full">
							{unreadCounts[user.id] > 99 ? "99+" : unreadCounts[user.id]}
						</span>
					)}
				</div>
			</div>
		</div>
	);
};

export default ConversationItem;
