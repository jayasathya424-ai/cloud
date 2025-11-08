import React from "react";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, login } = useAuth();

  // ✅ Show loading state while Firebase checks user session
  if (user === undefined) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-600">
        Checking authentication...
      </div>
    );
  }

  // ✅ Show login prompt if user not authenticated
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-10">
        <p className="text-lg font-medium mb-4 text-gray-700">
          Please sign in to continue
        </p>
        <button
          onClick={login}
          className="bg-blue-600 text-white px-5 py-2 rounded-md font-medium shadow-md hover:bg-blue-700 transition-all"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  // ✅ Allow access when logged in
  return <>{children}</>;
};

export default ProtectedRoute;
