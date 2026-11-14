import React from "react";
import {
  ArrowUpRight,
  BookOpen,
  GraduationCap,
  IndianRupee,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";

const metrics = [
  {
    label: "Total courses",
    value: "12",
    note: "Across your catalog",
    icon: BookOpen,
    colors: "bg-violet-100 text-violet-700",
  },
  {
    label: "Total users",
    value: "248",
    note: "Registered learners",
    icon: UsersRound,
    colors: "bg-emerald-100 text-emerald-700",
  },
  {
    label: "Total enrollments",
    value: "532",
    note: "Across all courses",
    icon: GraduationCap,
    colors: "bg-sky-100 text-sky-700",
  },
  {
    label: "Total revenue",
    value: "₹1,48,000",
    note: "Overview",
    icon: IndianRupee,
    colors: "bg-amber-100 text-amber-700",
  },
];

const recentEnrollments = [
  { initials: "AS", name: "Amit Sahu", course: "React Full Stack Development", time: "2 hours ago", color: "bg-violet-100 text-violet-700" },
  { initials: "RK", name: "Riya Kanhar", course: "DevOps Bootcamp", time: "4 hours ago", color: "bg-emerald-100 text-emerald-700" },
  { initials: "DP", name: "Debasish P.", course: "AI & Machine Learning", time: "6 hours ago", color: "bg-amber-100 text-amber-700" },
];

const chartPoints = "32,154 103,154 174,132 245,138 316,105 387,99 458,42";

export default function AdminDashboard() {
  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-violet-600">
            Platform overview
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Admin dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Here’s what’s happening across your learning platform.
          </p>
        </div>
        <Link
          to="/admin/courses"
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          View courses <ArrowUpRight size={16} />
        </Link>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Platform metrics">
        {metrics.map(({ label, value, note, icon: Icon, colors }) => (
          <article
            key={label}
            className="flex min-h-32 items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/2"
          >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colors}`}>
              <Icon size={21} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500">{label}</p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
              <p className="mt-1 text-[11px] text-slate-400">{note}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/2 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Enrollments</h2>
              <p className="mt-1 text-xs text-slate-500">Enrollment activity · Last 7 days</p>
            </div>
            <span className="rounded-md bg-violet-50 px-2.5 py-1 text-[11px] font-semibold text-violet-700">
              This week
            </span>
          </div>
          <div className="mt-5">
            <svg
              viewBox="0 0 490 205"
              className="h-56 w-full overflow-visible"
              role="img"
              aria-label="Sample enrollment chart for Monday through Sunday"
            >
              {[30, 65, 100, 135, 170].map((y, index) => (
                <g key={y}>
                  <line x1="30" x2="470" y1={y} y2={y} stroke="#e9edf4" strokeDasharray="4 5" />
                  <text x="20" y={y + 4} textAnchor="end" fill="#94a3b8" fontSize="10">
                    {(4 - index) * 25}
                  </text>
                </g>
              ))}
              <polygon points={`32,170 ${chartPoints} 458,170`} fill="#7047e8" fillOpacity=".10" />
              <polyline points={chartPoints} fill="none" stroke="#7047e8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {chartPoints.split(" ").map((point) => {
                const [cx, cy] = point.split(",");
                return <circle key={point} cx={cx} cy={cy} r="4" fill="white" stroke="#7047e8" strokeWidth="2.5" />;
              })}
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
                <text key={day} x={32 + index * 71} y="194" textAnchor="middle" fill="#94a3b8" fontSize="10">
                  {day}
                </text>
              ))}
            </svg>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/2 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent enrollments</h2>
              <p className="mt-1 text-xs text-slate-500">Latest students to join a course</p>
            </div>
            <button type="button" className="text-xs font-semibold text-violet-700">View all</button>
          </div>
          <div className="mt-4 divide-y divide-slate-100">
            {recentEnrollments.map((entry) => (
              <div key={entry.name} className="flex min-h-16.5 items-center gap-3 py-2">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${entry.color}`}>
                  {entry.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-800">{entry.name}</p>
                  <p className="mt-1 truncate text-[11px] text-slate-500">{entry.course}</p>
                </div>
                <time className="shrink-0 text-[10px] text-slate-400">{entry.time}</time>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
