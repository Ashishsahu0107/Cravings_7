import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoLight from "../assets/transparentLogoLight.png";
import { useAuth } from "../context/AuthContext";
import { FaPowerOff, FaPalette } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../config/ApiConfig";

const themeOptions = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "corporate", label: "Corporate" },
  { value: "gourmet", label: "Gourmet" },
  { value: "pastel", label: "Pastel" },
  { value: "shadcn", label: "Shadcn" },
  { value: "slack", label: "Slack" },
  { value: "mintlify", label: "Mintlify" },
];

const Navbar = () => {
  const { user, isLogin, role, setUser, setIsLogin, setRole } = useAuth();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("cravings-theme") || "light";
    return themeOptions.some((option) => option.value === savedTheme)
      ? savedTheme
      : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("cravings-theme", theme);
  }, [theme]);

  const handleNavigate = () => {
    //console.log("Handle Navigate", role);

    if (role === "restaurant") {
      navigate("/restaurant-dashboard");
    } else if (role === "rider") {
      navigate("/rider-dashboard");
    } else if (role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/customer-dashboard");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await api.get("/auth/logout");
      toast.success(res.data.message);

      sessionStorage.removeItem("cravingUser");
      setUser(null);
      setIsLogin(false);
      setRole(null);
      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unknown error occurred during registration. Please try again.",
      );
    }
  };

  return (
    <>
      <div className="sticky top-0 z-99 flex items-center justify-between px-12 py-1 bg-primary text-white w-full h-16 shadow-md">
        <div className="h-full">
          <Link to="/">
            <img src={logoLight} alt="Logo" className="w-fit h-full" />{" "}
          </Link>
        </div>
        <div className="flex itmes-center ">
          <div className="flex items-center">
            <label className="flex items-center gap-2 rounded-md border border-white/20 bg-base-100/10 px-3 py-1 text-sm text-white">
              <FaPalette className="shrink-0" />
              <span className="hidden sm:inline">Theme</span>
              <select
                value={theme}
                onChange={(event) => setTheme(event.target.value)}
                className="bg-transparent outline-none "
                aria-label="Theme selection"
              >
                {themeOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="text-primary"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {isLogin ? (
            <div className="flex items-center gap-2">
              <button
                className="flex gap-2 items-center text-primary-content border border-transparent hover:border-primary-content  px-3 py-1 rounded"
                title="Go to Dashboard"
                onClick={handleNavigate}
              >
                <img
                  src={user?.photo.url}
                  alt={user?.fullName}
                  className="w-12 h-12 rounded-full object-cover object-top"
                />
                <div className="flex flex-col items-start">
                  <span className="text-base">{user?.fullName}</span>
                  <span className="text-xs text-primary-content/80 uppercase">
                    {role}
                  </span>
                </div>
              </button>
              <button
                onClick={handleLogout}
                className="text-primary-content border border-transparent hover:border-primary-content hover:bg-error px-3 py-3 rounded"
                title="Logout"
              >
                <FaPowerOff />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-primary-content border border-transparent hover:border-primary-content px-3 py-1 rounded"
              >
                Login
              </Link>
              <Link
                to="/register/customer"
                className="bg-primary-content text-primary hover:bg-primary hover:text-primary-content border px-3 py-1 rounded"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
