import apiClient from "../utils/apiClient";

const conversationService = {
	getConversations: async () => {
		const response = await apiClient.get("/conversations");
		return response.data;
	},
};

export default conversationService;
