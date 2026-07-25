import { useQuery } from "@tanstack/react-query";
import conversationService from "../services/conversationService.ts";

export function useConversations() {
	return useQuery({
		queryKey: ["conversations"],
		queryFn: conversationService.fetchConversations,
		retry: false,
	});
}
