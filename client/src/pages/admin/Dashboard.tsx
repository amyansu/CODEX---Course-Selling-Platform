import React, { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  GraduationCap,
  IndianRupee,
  RefreshCw,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";

type AdminOverview = {
  totalCourses: number;
  totalUsers: number;
  totalEnrollments: number;
  estimatedRevenue: number;
  dailyEnrollments: { day: string; count: number }[];
  recentEnrollments: {
    id: number;
    userName: string;
    courseTitle: string;
    enrolledAt: string;
  }[];
};

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
const number = new Intl.NumberFormat("en-IN");

async function fetchAdminOverview(): Promise<AdminOverview> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/overview`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "message" in data
        ? String(data.message)
        : "Unable to load dashboard data.";
    throw new Error(message);
  }

  if (
    !data ||
    typeof data !== "object" ||
    !("dailyEnrollments" in data) ||
    !Array.isArray(data.dailyEnrollments) ||
    !("recentEnrollments" in data) ||
    !Array.isArray(data.recentEnrollments)
  ) {
    throw new Error("The server returned an invalid dashboard response.");
  }

  return data as AdminOverview;
}

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase() || "U"
  );
}

function formatTimeAgo(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  const minutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60_000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days < 7 ? `${days}d ago` : date.toLocaleDateString();
}

export default function AdminDashboard() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchAdminOverview()
      .then((result) => {
        if (active) setOverview(result);
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load dashboard data.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    setError("");
    try {
      setOverview(await fetchAdminOverview());
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load dashboard data.",
      );
    } finally {
      setLoading(false);
    }
  };

  const metrics = overview
    ? [
        {
          label: "Total courses",
          value: number.format(overview.totalCourses),
          note: "Across your catalog",
          icon: BookOpen,
          colors: "bg-violet-100 text-violet-700",
        },
        {
          label: "Total users",
          value: number.format(overview.totalUsers),
          note: "Registered learners",
          icon: UsersRound,
          colors: "bg-emerald-100 text-emerald-700",
        },
        {
          label: "Total enrollments",
          value: number.format(overview.totalEnrollments),
          note: "Across all courses",
          icon: GraduationCap,
          colors: "bg-sky-100 text-sky-700",
        },
        {
          label: "Estimated revenue",
          value: currency.format(overview.estimatedRevenue),
          note: "At current course prices",
          icon: IndianRupee,
          colors: "bg-amber-100 text-amber-700",
        },
      ]
    : [];

  const chartWidth = 490;
  const chartTop = 30;
  const chartBottom = 170;
  const chartValues = overview?.dailyEnrollments ?? [];
  const chartMax = Math.max(4, ...chartValues.map(({ count }) => count));
  const chartAxisMax = Math.max(4, Math.ceil(chartMax / 4) * 4);
  const chartPoints = chartValues.map((entry, index) => ({
    ...entry,
    x: 32 + (chartValues.length > 1 ? (index / (chartValues.length - 1)) * 426 : 213),
    y:
      chartBottom -
      (entry.count / chartAxisMax) * (chartBottom - chartTop),
  }));
  const chartLine = chartPoints
    .map(({ x, y }, index) => `${index === 0 ? "M" : "L"} ${x} ${y}`)
    .join(" ");
  const chartArea = chartPoints.length
    ? `${chartLine} L ${chartPoints[chartPoints.length - 1].x},${chartBottom} L ${chartPoints[0].x},${chartBottom} Z`
    : "";

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
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void handleRefresh()}
            disabled={loading}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <Link
            to="/admin/courses"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            View courses <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => void handleRefresh()}
            className="font-semibold underline underline-offset-2"
          >
            Try again
          </button>
        </div>
      )}

      {loading && !overview ? (
        <div
          role="status"
          className="rounded-xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500"
        >
          Loading dashboard data…
        </div>
      ) : overview ? (
        <>
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
        <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/2 sm:p-6">
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
              viewBox={`0 0 ${chartWidth} 205`}
              className="h-56 w-full overflow-visible"
              role="img"
              aria-label="Enrollment activity for the last seven days"
            >
              {[30, 65, 100, 135, 170].map((y, index) => (
                <g key={y}>
                  <line x1="30" x2="470" y1={y} y2={y} stroke="#e9edf4" strokeDasharray="4 5" />
                  <text x="20" y={y + 4} textAnchor="end" fill="#94a3b8" fontSize="10">
                    {Math.round(chartAxisMax * (1 - index / 4))}
                  </text>
                </g>
              ))}
              {chartArea && <path d={chartArea} fill="#7047e8" fillOpacity=".10" />}
              {chartPoints.length > 1 && (
                <path
                  d={chartLine}
                  fill="none"
                  stroke="#7047e8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              {chartPoints.map(({ day, count, x, y }) => (
                <g key={day}>
                  <title>{`${count} enrollments`}</title>
                  <circle cx={x} cy={y} r="4" fill="white" stroke="#7047e8" strokeWidth="2.5" />
                  <text
                    x={x}
                    y="194"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="10"
                  >
                    {new Date(`${day}T00:00:00Z`).toLocaleDateString(undefined, {
                      weekday: "short",
                      timeZone: "UTC",
                    })}
                  </text>
                </g>
              ))}
              {!chartPoints.length && (
                <text x="245" y="105" textAnchor="middle" fill="#94a3b8" fontSize="11">
                  No enrollments in this period
                </text>
              )}
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
          {overview.recentEnrollments.length ? (
            <div className="mt-4 divide-y divide-slate-100">
              {overview.recentEnrollments.map((entry, index) => (
                <div key={entry.id} className="flex min-h-16.5 items-center gap-3 py-2">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                      [
                        "bg-violet-100 text-violet-700",
                        "bg-emerald-100 text-emerald-700",
                        "bg-amber-100 text-amber-700",
                        "bg-sky-100 text-sky-700",
                      ][index % 4]
                    }`}
                  >
                    {getInitials(entry.userName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-slate-800">{entry.userName}</p>
                    <p className="mt-1 truncate text-[11px] text-slate-500">{entry.courseTitle}</p>
                  </div>
                  <time
                    dateTime={entry.enrolledAt}
                    title={new Date(entry.enrolledAt).toLocaleString()}
                    className="shrink-0 text-[10px] text-slate-400"
                  >
                    {formatTimeAgo(entry.enrolledAt)}
                  </time>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-8 rounded-lg bg-slate-50 px-4 py-7 text-center text-xs text-slate-500">
              No enrollments yet. New enrollments will appear here.
            </p>
          )}
        </article>
      </section>
        </>
      ) : null}
    </div>
  );
}
