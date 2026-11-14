import Appbar from "@/components/Appbar";
import CourseCard from "@/components/CourseCard";
import Footer from "@/components/Footer";
import React from "react";
import { useState, useEffect } from "react";

interface Course {
  id: number;
  title: string;
  description: string;
  originalPrice: number;
  price: number;
  image: string;
}

function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${import.meta.env.VITE_API_URL}/courses`);
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        setCourses(data);
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

  return (
    <div className="min-h-screen bg-black">
      <Appbar />
      <div className="m-6 text-white">
        <h1 className="text-3xl font-bold mt-8">Courses</h1>
        {loading ? (
          <p className="pt-6">Loading courses...</p>
        ) : error ? (
          <p className="pt-6">{error}</p>
        ) : (
          <div className="grid grid-cols-4 gap-4 pt-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Courses;
