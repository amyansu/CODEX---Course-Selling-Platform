import React, { useEffect, useState } from "react";
import { ArrowLeft, ImagePlus, UploadCloud } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

type CourseFormProps = {
  mode: "create" | "edit";
};

type Course = {
  id: number;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
};

export default function CourseForm({ mode }: CourseFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [image, setImage] = useState("");

  const [loading, setLoading] = useState(mode === "edit");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isEdit = mode === "edit";

  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch existing course in edit mode
  useEffect(() => {
    if (!isEdit) {
      return;
    }

    const getCourse = async () => {
      try {
        setLoading(true);
        setError("");

        if (!id) {
          throw new Error("Course ID is missing");
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/courses/${id}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch course");
        }

        const data: Course = await response.json();

        setTitle(data.title);
        setDescription(data.description);
        setPrice(String(data.price));
        setOriginalPrice(String(data.originalPrice));
        setImage(data.image || "");
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Something went wrong",
        );
      } finally {
        setLoading(false);
      }
    };

    getCourse();
  }, [id, isEdit]);

  // Create or update course
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      if (isEdit && !id) {
        throw new Error("Course ID is missing");
      }

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login again");
      }

      const method = isEdit ? "PUT" : "POST";

      const url = isEdit
        ? `${import.meta.env.VITE_API_URL}/courses/${id}`
        : `${import.meta.env.VITE_API_URL}/courses`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          price: Number(price),
          originalPrice: Number(originalPrice),
          image,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Failed to save course");
      }

      navigate("/admin/courses");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="p-6 text-sm text-slate-500">Loading course...</p>;
  }

  if (error && isEdit && !title) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-rose-600">{error}</p>
        <Link to="/admin/courses">Back to courses</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/admin/courses"
          className="mb-4 inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-violet-700"
        >
          <ArrowLeft size={15} /> Back to courses
        </Link>

        <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-violet-600">
          Course catalog
        </p>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {isEdit ? "Edit course" : "Add a course"}
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          {isEdit
            ? "Update course information and keep your catalog up to date."
            : "Create a new learning experience for your students."}
        </p>
      </div>

      <form
        className="grid gap-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/2 sm:p-7 lg:grid-cols-[minmax(0,1fr)_300px]"
        onSubmit={handleSubmit}
      >
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <h2 className="text-sm font-bold text-slate-800">Course details</h2>
            <span className="text-[10px] text-slate-400">
              Fields marked * are required
            </span>
          </div>

          <label className="block space-y-2">
            <span className="text-xs font-semibold text-slate-700">
              Course title <b className="text-rose-500">*</b>
            </span>
            <input
              required
              value={title}
              placeholder="e.g. Full Stack Development"
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100/70"
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-xs font-semibold text-slate-700">
                Price (INR) <b className="text-rose-500">*</b>
              </span>
              <div className="flex h-10 items-center rounded-lg border border-slate-200 focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100/70">
                <span className="pl-3 text-sm text-slate-400">₹</span>
                <input
                  required
                  type="number"
                  min="0"
                  placeholder="4999"
                  value={price}
                  className="h-full w-full rounded-r-lg border-0 bg-transparent px-2 text-sm outline-none"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-xs font-semibold text-slate-700">
                Original price (INR) <b className="text-rose-500">*</b>
              </span>
              <div className="flex h-10 items-center rounded-lg border border-slate-200 focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100/70">
                <span className="pl-3 text-sm text-slate-400">₹</span>
                <input
                  required
                  type="number"
                  min="0"
                  placeholder="7999"
                  value={originalPrice}
                  className="h-full w-full rounded-r-lg border-0 bg-transparent px-2 text-sm outline-none"
                  onChange={(e) => setOriginalPrice(e.target.value)}
                />
              </div>
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-xs font-semibold text-slate-700">
              Description <b className="text-rose-500">*</b>
            </span>
            <textarea
              required
              rows={6}
              value={description}
              placeholder="Describe what students will learn in this course..."
              className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-sm leading-6 outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100/70"
              onChange={(e) => setDescription(e.target.value)}
            />
            <span className="block text-[10px] text-slate-400">
              Share the key topics, projects, and outcomes students can expect.
            </span>
          </label>
        </div>

        <aside className="space-y-5">
          <label className="block space-y-2">
            <span className="text-xs font-semibold text-slate-700">
              Course thumbnail
            </span>

            <div className="flex min-h-44 flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 text-center">
              {image ? (
                <img
                  src={image}
                  alt="Course thumbnail"
                  className="h-44 w-full object-cover"
                />
              ) : (
                <>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                    <ImagePlus size={22} />
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    Image URL not provided
                  </span>
                </>
              )}
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Image URL
              </span>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/course-image.jpg"
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100/70"
              />
            </div>

            <span className="flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600">
              <UploadCloud size={15} />
              Course image
            </span>
          </label>

          <div className="rounded-lg border border-violet-100 bg-violet-50/60 p-4">
            <p className="text-xs font-bold text-violet-900">Good to know</p>
            <p className="mt-1.5 text-[11px] leading-5 text-violet-800/75">
              A clear landscape image works best for course cards and the
              student catalog. You can paste a direct image link here.
            </p>
          </div>
        </aside>

        {error && (
          <p className="text-sm text-rose-600 lg:col-span-2">{error}</p>
        )}

        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end lg:col-span-2">
          <Link
            to="/admin/courses"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-violet-600 px-4 text-xs font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? "Saving..."
              : isEdit
                ? "Save changes"
                : "Create course"}
          </button>
        </div>
      </form>
    </div>
  );
}
