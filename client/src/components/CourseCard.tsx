
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  originalPrice: number;
}

function CourseCard({ course }: { course: Course }) {
  const navigate = useNavigate();

  const discountPercentage =
    course.originalPrice > 0
      ? Math.round(
          ((course.originalPrice - course.price) /
            course.originalPrice) *
            100
        )
      : 0;

  return (
    <Card
      className="h-full flex flex-col bg-transparent border border-gray-900 rounded-lg cursor-pointer overflow-hidden hover:border-gray-600 transition-colors"
      onClick={() => navigate(`/course/${course.id}`)}
    >
      {/* Course Image */}
      <img
        src={course.image}
        alt={course.title}
        className="w-full aspect-video object-cover"
      />

      {/* Card Content */}
      <CardContent className="p-5 flex flex-col flex-1">

        {/* Course Title */}
        <p className="text-amber-100 font-bold text-xl line-clamp-2 min-h-14">
          {course.title}
        </p>

        {/* Price Section */}
        <div className="mt-auto pt-6">

          <div className="flex items-center justify-between gap-2 flex-wrap">

            <p className="text-white text-xl font-extrabold">
              ₹{course.price.toLocaleString("en-IN")}
            </p>

            <p className="text-white text-sm font-extralight line-through">
              ₹{course.originalPrice.toLocaleString("en-IN")}
            </p>

            <p className="text-green-500 text-sm font-semibold">
              {discountPercentage}% off
            </p>

          </div>

          {/* View Button */}
          <div className="flex justify-end mt-4">
            <Button
              className="bg-white text-black rounded-md hover:bg-gray-200 cursor-pointer px-6"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/course/${course.id}`);
              }}
            >
              View
            </Button>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}

export default CourseCard;
