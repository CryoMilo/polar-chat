import apiClient from "../utils/apiClient";

const conversationService = {
	fetchConversations: async () => {
		const response = await apiClient.get("/conversations");
		return response.data;
	},

	checkConnectCode: async (connectCode: string) => {
		const response = await apiClient.get("/conversations/check-connect-code", {
			params: {
				connectCode,
			},
		});
		return response.data;
	},

	addConversation: async (connectCode: string) => {
		const response = await apiClient.post("/conversations/add", {
			connectCode,
		});
		return response.data;
	},
};

export default conversationService;
