import { useState } from "react";
import LoginForm from "./partials/LoginForm";
import RegisterForm from "./partials/RegisterForm";
import Logo from "../../components/ui/Logo";

const Auth: React.FC = () => {
	const [isLogin, setIsLogin] = useState(true);

	return (
		<div className="min-h-screen flex flex-col md:flex-row bg-[#0b0f19] select-none">
			{/* Left section: Decorative Brand panel */}
			<div className="w-full md:w-1/2 bg-gradient-to-tr from-indigo-950 via-[#0f172a] to-[#0b0f19] border-b md:border-b-0 md:border-r border-slate-800/40 flex items-center justify-center p-8">
				<div className="flex flex-col items-center gap-6 text-center max-w-sm">
					<div className="bg-blue-600/10 border border-blue-500/20 rounded-3xl p-4 shadow-xl shadow-blue-500/5 animate-pulse">
						<Logo size={56} />
					</div>
					<div>
						<h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-linear-to-r from-blue-400 to-indigo-200 bg-clip-text text-transparent">
							Polar Chat
						</h1>
						<p className="mt-3 text-xs md:text-sm text-slate-400 tracking-widest uppercase font-semibold">
							Get in touch like never before
						</p>
					</div>
				</div>
			</div>

			{/* Right section: Login/Register forms */}
			<div className="w-full md:w-1/2 flex items-center justify-center p-8">
				<div className="w-full max-w-md">
					{isLogin ? (
						<LoginForm onSwitch={() => setIsLogin(false)} />
					) : (
						<RegisterForm onSwitch={() => setIsLogin(true)} />
					)}
				</div>
			</div>
		</div>
	);
};

export default Auth;
