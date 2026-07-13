import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../../stores/authStore.js";

export function PrivateRoute() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	return isAuthenticated ? <Outlet /> : <Navigate to="/auth" />;
}

export function GuestRoute() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}
