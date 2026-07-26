export const shortLocale = {
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
