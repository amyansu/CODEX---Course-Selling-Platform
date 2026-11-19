
import Appbar from "@/components/Appbar";
import Footer from "@/components/Footer";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Course {
  id: number;
  title: string;
  description: string;
  originalPrice: number;
  price: number;
  image: string;
}

interface EnrolledCourse {
  courseId: number;
}

interface User {
  role: string;
}

function CourseDetails() {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const user: User | null = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const isAdmin = user?.role === "admin";

  // Fetch course details
  useEffect(() => {
    const getCourse = async () => {
      try {
        setLoading(true);
        setError("");

        if (!id) {
          throw new Error("Course ID is missing");
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/courses/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch course");
        }

        const data = await response.json();
        setCourse(data);

      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    getCourse();
  }, [id]);

  // Check whether user is already enrolled
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!token || !id || isAdmin) {
        setIsEnrolled(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/my-courses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to check enrollment");
        }

        const data: EnrolledCourse[] = await response.json();

        const enrolled = data.some(
          (item) => Number(item.courseId) === Number(id)
        );

        setIsEnrolled(enrolled);

      } catch (error) {
        console.error("Enrollment check error:", error);
      }
    };

    checkEnrollment();
  }, [id, token, isAdmin]);

  // Handle enrollment
  const handleBuyNow = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (isAdmin) {
      return;
    }

    if (isEnrolled) {
      navigate("/my-courses");
      return;
    }

    if (!id) {
      alert("Course ID is missing");
      return;
    }

    try {
      setEnrolling(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/enrollments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            courseId: Number(id),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Enrollment failed");
      }

      setIsEnrolled(true);
      alert("Enrollment successful!");

    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Appbar />
        <main className="flex flex-1 items-center justify-center">
          <div role="status" className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-700 border-t-white" />
            <p className="text-gray-300">Loading course...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) return <p>{error}</p>;

  if (!course) return <p>Course not found</p>;

  const originalPrice = course.originalPrice ?? course.price;

  const discountPercentage =
    originalPrice > course.price
      ? Math.round(
          ((originalPrice - course.price) / originalPrice) * 100
        )
      : 0;

  return (
    <div className="bg-black min-h-screen">
      <Appbar />

      <div className="flex justify-between items-start text-white m-8">
        <div className="m-8 max-w-xl">
          <h1 className="text-4xl font-bold text-amber-100 mt-4">
            {course.title}
          </h1>

          <p className="mt-6 text-gray-300 text-lg">
            {course.description}
          </p>
        </div>

        <Card className="w-90 bg-gray-950 border border-gray-600 rounded-md h-full">
          <img src={course.image} alt="image" className="w-full" />

          <CardContent>
            <div className="flex items-center gap-4 pt-12">
              <span className="text-white text-3xl font-extrabold">
                ₹{course.price.toLocaleString("en-IN")}
              </span>

              <span className="text-white text-md font-extralight line-through">
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>

              <span className="text-green-500 text-sm font-semibold ml-4 p-1 border border-gray-800 rounded-full">
                {discountPercentage}% off
              </span>
            </div>

            <div className="w-full max-w-md space-y-4">
              <div>
                <p className="mt-4 text-sm text-gray-400">
                  Payment currency
                </p>

                <div className="h-12 mt-2 w-full rounded-md border border-gray-800 bg-transparent px-4 flex items-center text-white">
                  INR - Indian rupee
                </div>
              </div>

              {/* Hide Buy Now for Admin */}
              {!isAdmin && (
                <div className="flex flex-col gap-4">
                  <Button
                    onClick={handleBuyNow}
                    disabled={enrolling}
                    className="h-14 w-full bg-white text-black hover:bg-gray-200 cursor-pointer"
                  >
                    {enrolling
                      ? "Enrolling..."
                      : isEnrolled
                        ? "Go to Course"
                        : "Buy now"}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}

export default CourseDetails;
