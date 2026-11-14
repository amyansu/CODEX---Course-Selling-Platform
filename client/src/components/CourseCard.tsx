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
  const discountPercentage = Math.round(
    ((course.originalPrice - course.price) / course.originalPrice) * 100,
  );
  return (
    <div>
      <div className="flex-1 min-w-0">
        <Card
          className="bg-transparent border border-gray-900 rounded-sm cursor-pointer overflow-hidden hover:border-gray-600 min-h-100"
          onClick={() => navigate(`/course/${course.id}`)}
        >
          <img src={course.image} alt={course.title} className="w-full" />
          <CardContent>
            <p className="text-amber-100 font-bold mt-4 text-xl">{course.title}</p>
            <div className="flex items-center justify-between gap-2 pt-20">
              <p className="text-white text-xl font-extrabold">
                ₹{course.price.toLocaleString("en-IN")}
              </p>
              <p className="text-white text-md font-extralight line-through">
                ₹{course.originalPrice.toLocaleString("en-IN")}
              </p>
              <p className="text-green-500 text-sm font-semibold pl-4 pr-2">
                {discountPercentage}% off
              </p>
            </div>
            <Button className="bg-white text-black rounded-sm hover:bg-gray-200 cursor-pointer ml-48 mt-2 p-4">
              View
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CourseCard;
