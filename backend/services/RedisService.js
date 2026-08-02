import { createClient } from "redis";

class RedisService {
	constructor() {
		this.client = null;
	}

	async initialize() {
		if (this.client) return;

		try {
			this.client = createClient({
				url: process.env.REDIS_URL,
			});

			this.client.on("error", (error) =>
				console.error("Redis Client error", error)
			);

			await this.client.connect();
			console.log("Redis connected");
		} catch (error) {
			console.error("Failed to initialize Redis", error);
		}
	}

	async disconnect() {
		if (this.client) {
			this.client.quit();
			this.client = null;
			console.log("Redis disconnected");
		}
	}
}

export default new RedisService();
