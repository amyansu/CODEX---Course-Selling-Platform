import React from "react";
import Appbar from "@/components/Appbar";
import CourseCard from "@/components/CourseCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  originalPrice: number;
}

function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/courses`);
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch courses",
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
      <div className="flex flex-col items-center p-2">
        <div className="flex justify-center mt-20">
          <p className="text-5xl font-bold text-white">
            CODE<span className="text-red-500">X</span> by 100xDevs
          </p>
        </div>
        <div className="mt-6">
          <p className="text-gray-400">
            Practical coding cohorts and bootcamps in web development, DevOps,
            Web3, AI and machine learning.
          </p>
        </div>
        <div className="mt-12 flex justify-between items-center gap-2">
          <Button
            className={`p-6 w-40 bg-white text-black hover:bg-gray-200 cursor-pointer ${isLoggedIn ? "rounded-full" : ""}`}
            onClick={() => navigate(isLoggedIn ? "/my-courses" : "/courses")}
          >
            {isLoggedIn ? "Go to Purchases" : "Explore Courses"}
          </Button>
          <Button
            className={`p-6 w-40 text-black bg-white hover:bg-gray-200 cursor-pointer ${isLoggedIn ? "rounded-full" : ""}`}
            onClick={() => navigate(isLoggedIn ? "/courses" : "/signup")}
          >
            {isLoggedIn ? "Browse Courses" : "Get Started"}
          </Button>
        </div>
        <div className="mt-8 flex justify-around gap-8">
          <a
            href="/courses"
            className="text-blue-500 cursor-pointer hover:underline"
          >
            100xDevs Bootcamp
          </a>
          <a
            href="/courses"
            className="text-blue-500 cursor-pointer hover:underline"
          >
            100xDevs Cohort
          </a>
          <a
            href="/courses"
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Full Stack Cohort
          </a>
          <a
            href="/courses"
            className="text-blue-500 cursor-pointer hover:underline"
          >
            DevOps Bootcamp
          </a>
          <a
            href="/courses"
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Web3 Bootcamp
          </a>
          <a
            href="/courses"
            className="text-blue-500 cursor-pointer hover:underline"
          >
            AI Bootcamp
          </a>
        </div>
        <div className="grid grid-cols-3 gap-8 my-6 mx-18">
          <a href="/course" className="w-full cursor-pointer rounded-lg">
            <img src="/images.jpg" alt="" />
          </a>
          <a href="/course" className="w-full cursor-pointer rounded-lg">
            <img src="/images.jpg" alt="" />
          </a>
          <a href="/course" className="w-full cursor-pointer rounded-lg">
            <img src="/images.jpg" alt="" />
          </a>
        </div>
        <div className="w-280 rounded-xl bg-gray-900 text-white py-10 px-8 mt-8">
          <h1 className="text-3xl mb-4 font-bold">
            Learn by building with CODE<span className="text-red-500">X</span>
          </h1>
          <p className="mb-6">
            Join 100xDevs project-based cohorts and bootcamps for a structured
            path <br />
            from fundamentals to production systems.
          </p>
          <Button
            className="bg-white text-blue-500 py-5 px-4 cursor-pointer hover:bg-gray-100"
            onClick={() => navigate("/courses")}
          >
            Browse cohorts
            <ArrowRight />
          </Button>
        </div>
        <div className="mt-10 w-full flex flex-col px-12 py-8">
          <div className=" w-full flex justify-between">
            <h1 className="text-2xl text-white font-bold">Featured Cohorts</h1>
            <Button
              className="bg-transparent hover:bg-transparent hover:underline cursor-pointer text-blue-500 text-sm flex items-center mr-20"
              onClick={() => navigate("/courses")}
            >
              View all <ArrowRight className="h-4 w-8" />
            </Button>
          </div>
          {loading ? (
            <div
              className="flex justify-center py-12"
              role="status"
              aria-label="Loading courses"
            >
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-blue-500" />
            </div>
          ) : error ? (
            <p className="pt-6 text-center text-red-400" role="alert">
              {error}
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-4 pt-6">
              {courses.slice(0, 4).map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
