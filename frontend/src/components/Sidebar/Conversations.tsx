import {
	useConversationContext,
	type Conversation,
} from "../../contexts/ConversationsContext";
import ConversationItem from "./ConversationItem";

const Conversations: React.FC = () => {
	const { filteredConversations } = useConversationContext();

	return (
		<div className="flex-1 overflow-y-auto divide-y divide-slate-800/40 bg-[#0f172a] px-2 py-1 select-none">
			{filteredConversations.map(
				(chat: Conversation) =>
					chat.conversationId && (
						<ConversationItem
							key={chat.conversationId}
							friend={chat.friend}
							unreadCounts={chat.unreadCounts}
							conversationId={chat.conversationId}
							lastMessage={chat.lastMessage}
						/>
					)
			)}
		</div>
	);
};

export default Conversations;
