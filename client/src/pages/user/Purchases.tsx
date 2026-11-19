import React from "react";
import Appbar from "@/components/Appbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface EnrolledCourse {
  enrollmentId: number;
  enrolledAt: string;
  courseId: number;
  title: string;
  description: string;
  image: string;
  price: number;
  originalPrice: number;
}

function Purchases() {
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getMyCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/my-courses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to load your enrolled courses");
        }

        setCourses(await response.json());
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to load your enrolled courses",
        );
      } finally {
        setLoading(false);
      }
    };

    getMyCourses();
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <Appbar />

      <main className="mx-auto max-w-7xl px-6 py-10 text-white">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
              Learning dashboard
            </p>
            <h1 className="mt-2 text-4xl font-bold">My Courses</h1>
            <p className="mt-3 text-gray-400">
              Continue learning from the courses you have enrolled in.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/courses")}
            className="cursor-pointer bg-transparent text-gray-400 hover:bg-transparent hover:text-white"
          >
            ← Back to courses
          </Button>
        </div>

        {loading ? (
          <div className="flex min-h-72 items-center justify-center">
            <div
              role="status"
              className="h-12 w-12 animate-spin rounded-full border-4 border-gray-700 border-t-white"
            />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-900 bg-red-950/30 p-6">
            <p className="text-red-300">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-white text-black hover:bg-gray-200"
            >
              Try again
            </Button>
          </div>
        ) : courses.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-gray-800 bg-gray-950 px-6 text-center">
            <h2 className="text-2xl font-bold">No courses yet</h2>
            <p className="mt-2 max-w-md text-gray-400">
              Browse the course catalog and enroll in a course to start
              learning.
            </p>
            <Button
              onClick={() => navigate("/courses")}
              className="mt-6 bg-white text-black hover:bg-gray-200"
            >
              Browse to courses
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((course) => (
              <Card
                key={course.enrollmentId}
                className="flex h-full cursor-pointer flex-col overflow-hidden border-gray-800 bg-gray-950 transition-colors hover:border-gray-600"
                onClick={() => navigate(`/my-courses/${course.courseId}`)}
              >
                <img
                  src={course.image}
                  alt={course.title}
                  className="h-36 w-full object-cover"
                />
                <CardContent className="flex flex-1 flex-col p-4">
                  <h2 className="min-h-12 text-lg font-bold text-amber-100">
                    {course.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-400">
                    {course.description}
                  </p>
                  <p className="mt-5 text-sm text-gray-500">
                    Enrolled{" "}
                    {new Date(course.enrolledAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <div className="mt-auto flex justify-end pt-5">
                    <Button
                      className="bg-white text-black hover:bg-gray-200"
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/my-courses/${course.courseId}`);
                      }}
                    >
                      Continue learning
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Purchases;
