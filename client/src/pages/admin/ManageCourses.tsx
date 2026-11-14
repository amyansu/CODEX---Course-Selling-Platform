import React, { useEffect, useState } from "react";
import { BookOpen, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

interface Courses {
  id: number;
  title: string;
  description: string;
  originalPrice: number;
  price: number;
  image: string;
}

export default function ManageCourses() {
  const [courses, setCourses] = useState<Courses[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/admin/my-courses`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data: unknown = await response.json();
        const courseList = Array.isArray(data)
          ? data
          : data &&
              typeof data === "object" &&
              "courses" in data &&
              Array.isArray(data.courses)
            ? data.courses
            : data &&
                typeof data === "object" &&
                "data" in data &&
                Array.isArray(data.data)
              ? data.data
              : [];
        setCourses(courseList as Courses[]);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch courses",
        );
      } finally {
        setLoading(false);
      }
    };
    getCourses();
  }, []);

 const handleDelete = async (id: number) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this course?"
  );

  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/courses/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete course");
    }

    setCourses((prevCourses) =>
      prevCourses.filter((course) => course.id !== id)
    );
  } catch (error) {
    setError(
      error instanceof Error ? error.message : "Something went wrong"
    );
  }
};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-violet-600">
            Course catalog
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Manage courses
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            View, edit, and organize the courses on your platform.
          </p>
        </div>
        <Link
          to="/admin/courses/new"
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-violet-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-violet-700"
        >
          <Plus size={16} /> Add course
        </Link>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {error}
        </p>
      )}

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-900/2">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-sm font-bold text-slate-800">All courses</h2>
            <p className="mt-1 text-xs text-slate-500">
              {courses.length} {courses.length === 1 ? "course" : "courses"} in
              your catalog
            </p>
          </div>
          <label className="flex h-9 w-full max-w-xs items-center gap-2 rounded-lg border border-slate-200 px-3 text-slate-400 focus-within:border-violet-400">
            <Search size={16} />
            <input
              type="search"
              placeholder="Search courses"
              aria-label="Search courses"
              className="w-full border-0 bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-180 border-collapse text-left">
            <thead className="bg-slate-50/80">
              <tr className="text-[11px] font-semibold text-slate-500">
                <th className="px-5 py-3">#</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Original Price</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-8 text-center text-sm text-slate-500"
                    role="status"
                  >
                    Loading courses...
                  </td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-8 text-center text-sm text-slate-500"
                  >
                    No courses found.
                  </td>
                </tr>
              ) : (
                courses.map((course, index) => (
                  <tr
                    key={course.id}
                    className="text-xs text-slate-600 hover:bg-slate-50/60"
                  >
                    <td className="px-5 py-3.5 text-slate-400">{index + 1}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={course.image}
                          alt="image"
                          className="h-10 w-14 rounded-md border border-slate-200 object-cover"
                        />
                        <span className="font-semibold text-slate-800">
                          {course.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">
                      {course.price}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">
                      {course.originalPrice}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/courses/${course.id}/edit`}
                          aria-label={`Edit ${course.title}`}
                          className="rounded-md border border-slate-200 p-2 text-violet-700 hover:bg-violet-50"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          type="button"
                          aria-label={`Delete ${course.title}`}
                          className="rounded-md border border-rose-100 p-2 text-rose-600 hover:bg-rose-50 cursor-pointer"
                          onClick={() => handleDelete(course.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-[11px] text-slate-500">
          <span>
            Showing {courses.length} of {courses.length} courses
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <BookOpen size={14} /> Course catalog
          </span>
        </div>
      </section>
    </div>
  );
}
