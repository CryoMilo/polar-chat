import apiClient from "../utils/apiClient";

export type Message = {
	_id: string;
	conversation: string;
	sender: string;
	content: string;
	read: boolean;
	createdAt: string;
	updatedAt: string;
};

const messageService = {
	fetchMessages: async (conversationId: string, limit?: number, before?: string): Promise<Message[]> => {
		const response = await apiClient.get(`/messages/${conversationId}`, {
			params: { limit, before },
		});
		return response.data.data;
	},

	sendMessage: async (conversationId: string, content: string): Promise<Message> => {
		const response = await apiClient.post("/messages", {
			conversationId,
			content,
		});
		return response.data.data;
	},

	markAsRead: async (conversationId: string): Promise<void> => {
		await apiClient.post(`/conversations/${conversationId}/read`);
	},
};

export default messageService;
