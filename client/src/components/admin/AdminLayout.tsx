import React, { useState } from "react";
import {
  ArrowUpRight,
  Bell,
  BookOpen,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Plus,
  Settings,
  Users,
} from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

const navigation = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Manage courses", to: "/admin/courses", icon: BookOpen, end: true },
  { label: "Add course", to: "/admin/courses/new", icon: Plus },
];

const utilityLinks = [
  { label: "Enrolled users", icon: GraduationCap },
  { label: "Users", icon: Users },
  { label: "Settings", icon: Settings },
];

export default function AdminLayout() {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-slate-950 px-4 py-5 text-slate-300 md:flex">
        <Link to="/admin" className="mb-10 flex items-center gap-3 px-2">
          <img
            src="/logo.jpeg"
            alt=""
            className="h-9 w-9 rounded-full bg-white object-cover"
          />
          <span className="text-xl font-extrabold tracking-tight text-white">
            CODE<span className="text-rose-500">X</span>
          </span>
        </Link>

        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
          Workspace
        </p>
        <nav className="grid gap-1" aria-label="Admin navigation">
          {navigation.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-950/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <p className="mb-3 mt-8 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
          Manage
        </p>
        <nav className="grid gap-1" aria-label="Additional sections">
          {utilityLinks.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="flex h-11 items-center gap-3 rounded-lg px-3 text-sm text-slate-500 cursor-not-allowed"
            >
              <Icon size={18} />
              {label}
              <span className="ml-auto text-[10px]">Soon</span>
            </div>
          ))}
        </nav>

        <div className="mt-auto grid gap-2">
          <Link
            to="/"
            className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <ArrowUpRight size={17} />
            Back to website
          </Link>
          <Link
            to="/"
            className="rounded-lg bg-slate-900 px-3 py-3 text-xs text-slate-400"
          >
            Need help? <span className="float-right">↗</span>
          </Link>
        </div>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-7">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Menu"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
            >
              <Menu size={20} />
            </button>
            <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
              <span>Workspace</span>
              <span>/</span>
              <span className="font-semibold text-slate-700">Admin panel</span>
            </div>
            <nav className="flex gap-1 sm:hidden" aria-label="Admin navigation">
              {navigation.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="rounded-md px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                >
                  {label === "Manage courses" ? "Courses" : label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              type="button"
              aria-label="Notifications"
              className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
            </button>
            <div className="relative">
              <button
                type="button"
                aria-label="Admin profile menu"
                aria-expanded={profileMenuOpen}
                onClick={() => setProfileMenuOpen((open) => !open)}
                className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                  A
                </span>
                <span className="hidden sm:inline">Admin</span>
                <ChevronDown
                  size={15}
                  className="hidden text-slate-400 sm:block"
                />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-375 p-4 sm:p-7 lg:p-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
