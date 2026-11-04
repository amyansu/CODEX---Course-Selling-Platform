import React from "react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";

export default function Appbar() {
  const navigate = useNavigate();

  // Get user details from localStorage
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  let userName = "";

  if (token && storedUser) {
    try {
      const user = JSON.parse(storedUser);

      userName =
        user?.name ||
        user?.username ||
        localStorage.getItem("userName") ||
        localStorage.getItem("username") ||
        "Profile";
    } catch (error) {
      console.error("Error reading user data:", error);
    }
  }

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userName");
    localStorage.removeItem("username");

    navigate("/login");
  };

  return (
    <div>
      <div className="flex h-16 px-2 py-2 bg-gray-900 text-white items-center gap-2">
        {/* Logo */}
        <div className="ml-3">
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <img
              className="rounded-full w-10 h-10"
              src="/logo.jpeg"
              alt="CODEX Logo"
            />

            <p className="font-extrabold text-2xl">
              CODE<span className="text-red-500">X</span>
            </p>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex justify-end items-center ml-auto gap-2 mr-4">
          {userName ? (
            <>
              {/* User Profile */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <svg
                    aria-hidden="true"
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.42 0-8 2.24-8 5v3h16v-3c0-2.76-3.58-5-8-5Z" />
                  </svg>
                </div>

                <span className="font-medium">{userName}</span>
              </div>

              {/* Logout */}
              <Button
                onClick={handleLogout}
                className="bg-white h-9 text-black px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded-lg"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              {/* Login */}
              <Button
                onClick={() => navigate("/login")}
                className="bg-white h-9 text-black px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded-lg"
              >
                Login
              </Button>

              {/* Signup */}
              <Button
                onClick={() => navigate("/signup")}
                className="bg-white h-9 text-black px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded-lg"
              >
                Join now
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
