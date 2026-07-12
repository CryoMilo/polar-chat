import { Mail } from "lucide-react";
import { useState } from "react";
import LoginForm from "./partials/LoginForm";
import RegisterForm from "./partials/RegisterForm";

const Auth: React.FC = () => {
	const [isLogin, setIsLogin] = useState(false);

	return (
		<div className="min-h-screen flex">
			<div className="w-1/2 bg-blue-200">
				<div className="grid h-screen place-items-center">
					<div className="flex justify-center items-center flex-col gap-10">
						<div className="bg-blue-100 rounded-full p-5 w-fit">
							<Mail className="text-white" size={50} />
						</div>
						<div className="text-white">GET IN TOUCH LIKE NEVER BEFORE</div>
					</div>
				</div>
			</div>
			<div className="w-1/2">
				<div className="grid h-screen place-items-center">
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
