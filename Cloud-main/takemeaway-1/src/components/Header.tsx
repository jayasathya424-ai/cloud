import React from "react";
import { useAuth } from "../context/AuthContext";
import { User} from 'lucide-react';

const Header: React.FC = () => {
  const { user, login, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0b1d36] shadow-lg border-b-2 border-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <img
                 src="/takemeawaywhite.png"
                 className="w-44 md:w-64 h-20 object-cover"
                 alt="Logo"
            />
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                {user.photoURL ? (
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                    <User className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
                    {user.displayName ? user.displayName.charAt(0) : "U"}
                  </div>
                )}
                <button
                  onClick={logout}
                  className="px-3 py-1 bg-white text-[#0b1d36] rounded-md hover:opacity-90 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={login}
                className="px-3 py-1 bg-white text-[#0b1d36] rounded-md hover:opacity-90 transition"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
