import React from "react";

interface LogoProps {
	size?: number;
	className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 24, className = "" }) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 100 100"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<defs>
				<linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stopColor="#60a5fa" />
					<stop offset="100%" stopColor="#3b82f6" />
				</linearGradient>
			</defs>
			{/* Speech Bubble Base */}
			<path
				d="M50 15C30.67 15 15 30.67 15 50C15 57.65 17.47 64.71 21.65 70.47L16 84L30.13 79.29C36.03 82.88 42.81 85 50 85C69.33 85 85 69.33 85 50C85 30.67 69.33 15 50 15Z"
				fill="url(#logo-grad)"
			/>
			{/* Minimalist snowflake / ice lines */}
			<path
				d="M50 32V68M32 50H68M37.26 37.26L62.74 62.74M37.26 62.74L62.74 37.26"
				stroke="white"
				strokeWidth="5"
				strokeLinecap="round"
			/>
			{/* Snowflake ticks for extra detail */}
			<path
				d="M50 38L45 35M50 38L55 35M50 62L45 65M50 62L55 65M38 50L35 45M38 50L35 55M62 50L65 45M62 50L65 55"
				stroke="white"
				strokeWidth="4"
				strokeLinecap="round"
			/>
			<circle cx="50" cy="50" r="4.5" fill="white" />
		</svg>
	);
};

export default Logo;
