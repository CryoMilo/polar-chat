import React, { createContext, useContext, useState } from "react";

type MobileChatContextType = {
	isMobileChatOpen: boolean;
	setIsMobileChatOpen: (open: boolean) => void;
};

const MobileChatContext = createContext<MobileChatContextType>({
	isMobileChatOpen: false,
	setIsMobileChatOpen: () => {},
});

export const useMobileChat = () => useContext(MobileChatContext);

export const MobileChatProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

	return (
		<MobileChatContext.Provider
			value={{ isMobileChatOpen, setIsMobileChatOpen }}
		>
			{children}
		</MobileChatContext.Provider>
	);
};
