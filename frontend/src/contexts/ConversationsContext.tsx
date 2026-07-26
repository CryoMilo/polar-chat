import { createContext, useContext, useState } from "react";
import type { User } from "../../stores/authStore";
import { useConversations } from "../hooks/useConversation";

export type Conversation = {
	conversationId: string;
	friend: User & {
		online: boolean;
	};
	unreadCounts: Record<string, number>;
	lastMessage: {
		content: string;
		timestamp: Date;
	};
	img?: string;
};

type ConversationsContextype = {
	conversations: Conversation[];
	filteredConversations: Conversation[];
	searchTerm: string;
	setSearchTerm: (term: string) => void;

	isLoading: boolean;
	isError: boolean;
};

const ConversationsContext = createContext<ConversationsContextype | undefined>(
	undefined
);

// Clean hook to call context
// eslint-disable-next-line react-refresh/only-export-components
export const useConversationContext = () => {
	const context = useContext(ConversationsContext);
	if (!context)
		throw new Error(
			"useConversationsContext must be used within Conversations Provider"
		);
	return context;
};

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { data, isLoading, isError } = useConversations();
	const [searchTerm, setSearchTerm] = useState("");

	const conversations: Conversation[] = data?.data || [];

	const filteredConversations = conversations.filter((c) =>
		c.friend.username.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<ConversationsContext.Provider
			value={{
				conversations,
				filteredConversations,
				searchTerm,
				setSearchTerm,
				isLoading,
				isError,
			}}>
			{children}
		</ConversationsContext.Provider>
	);
};
