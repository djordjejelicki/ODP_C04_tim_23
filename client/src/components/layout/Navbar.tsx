import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuthHook";

export function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");        
    };

    return (
        <header className="bg-white shadow-sm">
            <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link to="/trails" className="text-2xl font-bold text-orange-700">
                TrailSync
                </Link>

                <div className="flex items-center gap-5">
                <Link to="/trails" className="text-gray-700 hover:text-orange-700">
                    Trails
                </Link>

                {isAuthenticated && (
                    <>
                    <Link to="/my-trails" className="text-gray-700 hover:text-orange-700">
                        My Trails
                    </Link>

                    <Link to="/ascents" className="text-gray-700 hover:text-orange-700">
                        Ascents
                    </Link>

                    <Link to="/hikes" className="text-gray-700 hover:text-orange-700">
                        Hikes
                    </Link>
                    </>
                )}

                {user?.role === "admin" && (
                    <Link to="/admin" className="text-gray-700 hover:text-orange-700">
                    Admin
                    </Link>
                )}

                {!isAuthenticated ? (
                    <>
                    <Link to="/login" className="text-gray-700 hover:text-orange-700">
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className="rounded-lg bg-orange-700 text-white px-4 py-2 hover:bg-orange-800"
                    >
                        Register
                    </Link>
                    </>
                ) : (
                    <button
                    onClick={handleLogout}
                    className="rounded-lg bg-gray-900 text-white px-4 py-2 hover:bg-gray-800"
                    >
                    Logout
                    </button>
                )}
                </div>
            </nav>
        </header>  
    );
}