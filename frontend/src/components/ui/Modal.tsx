import { XIcon } from "lucide-react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: React.ReactNode;
	footer?: React.ReactNode;
	size?: "sm" | "md" | "lg" | "xl";
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, size = "md" }) => {
	if (!isOpen) return null;

	const sizeClass = {
		sm: "max-w-sm",
		md: "max-w-md",
		lg: "max-w-lg",
		xl: "max-w-xl",
	}

	return <>
		<div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
			<div className="bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto w-full"
				style={{ maxWidth: sizeClass[size] }}>

				<div className="p-6 border-b border-gray-200 flex justify-between items-center">
					{title && <h3 className="text-xl font-bold text-gray-900">{title}</h3>}
					<button onClick={onClose} className="text-gray-500 hover:text-gray-700">
						<XIcon className="w-5 h-5" />
					</button>
				</div>
				<div className="p-6">
					{children}
				</div>
				{footer && <div className="p-6 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-xl">
					{footer}
				</div>}
			</div>
		</div>
	</>;
};

export default Modal;
