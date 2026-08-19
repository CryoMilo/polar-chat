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
		<div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-center items-center z-50">
			<div className="bg-[#0f172a] border border-slate-800/80 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto w-full"
				style={{ maxWidth: sizeClass[size] }}>

				<div className="p-6 border-b border-slate-800/60 flex justify-between items-center">
					{title && <h3 className="text-xl font-bold text-slate-100">{title}</h3>}
					<button onClick={onClose} className="text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 p-1.5 rounded-lg transition-colors duration-150">
						<XIcon className="w-5 h-5" />
					</button>
				</div>
				<div className="p-6">
					{children}
				</div>
				{footer && <div className="p-6 border-t border-slate-800/60 flex justify-end gap-3 bg-slate-900/40 rounded-b-2xl">
					{footer}
				</div>}
			</div>
		</div>
	</>;
};

export default Modal;
