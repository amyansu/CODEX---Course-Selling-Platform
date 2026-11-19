import React from "react";
import Appbar from "@/components/Appbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  originalPrice: number;
}

function MyCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/courses/${id}`,
        );
        if (!response.ok) {
          throw new Error("Failed to load course details");
        }

        setCourse(await response.json());
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to load course details",
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) getCourse();
  }, [id]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Appbar />

      <main className="mx-auto max-w-6xl px-6 py-10">
        {loading ? (
          <div className="flex min-h-96 items-center justify-center">
            <div
              role="status"
              className="h-12 w-12 animate-spin rounded-full border-4 border-gray-700 border-t-white"
            />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-900 bg-red-950/30 p-6">
            <p className="text-red-300">{error}</p>
            <Button
              onClick={() => navigate("/my-courses")}
              className="mt-4 bg-white text-black hover:bg-gray-200"
            >
              Back to my courses
            </Button>
          </div>
        ) : !course ? (
          <p>Course not found.</p>
        ) : (
          <>
            <Link
              to="/my-courses"
              className="text-sm text-gray-400 hover:text-white cursor-pointer"
            >
              ← Back to my courses
            </Link>

            <div className="mt-6 grid gap-8 lg:grid-cols-[3fr_1fr]">
              <div>
                <h1 className="text-4xl font-bold text-amber-100">
                  {course.title}
                </h1>
                <p className="mt-6 leading-8 text-gray-300">
                  {course.description}
                </p>

                <Card className="mt-10 border-gray-800 bg-gray-950">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold">Course content</h2>
                    <p className="mt-3 text-gray-400">
                      Your enrolled course is ready. Course lessons and learning
                      materials can be added here.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="h-fit overflow-hidden border-gray-800 bg-gray-950">
                <img
                  src={course.image}
                  alt={course.title}
                  className="aspect-video w-full object-cover"
                />
                <CardContent className="p-5">
                  <p className="text-sm text-green-500">Enrolled</p>
                  <h2 className="mt-2 text-xl font-bold">{course.title}</h2>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default MyCourse;