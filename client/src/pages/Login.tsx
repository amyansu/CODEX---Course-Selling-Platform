import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Appbar from "@/components/Appbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Signin failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (error) {
      console.error("Signin error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Appbar />
      <div className="flex justify-center items-center pt-20">
        <Card className="w-[35%] bg-gray-900 text-white p-4 rounded-md">
          <CardHeader>
            <div className="flex flex-col gap-4">
              <div>
                <CardTitle className="text-2xl py-2">
                  Welcome to 100xDevs
                </CardTitle>
                <CardDescription className="">
                  Log in to access paid content!
                </CardDescription>
              </div>
              <div className="flex gap-2 w-full rounded-lg bg-slate-800 p-1">
                <Button className="flex-1 rounded-md bg-gray-700 hover:bg-gray-700 h-11 cursor-pointer font-semibold text-white">
                  Password
                </Button>
                <Button className="flex-1 rounded-md bg-slate-800 hover:bg-slate-700 cursor-not-allowed h-11 text-base font-semibold text-gray-300">
                  Email OTP
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    className="h-11"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 text-blue-700 cursor-not-allowed"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="h-11 text-base"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 rounded-lg py-5 hover:bg-blue-700 cursor-pointer"
                >
                  {loading ? "Logging in..." : "Continue"}
                </Button>
              </div>
            </form>
            <span className="flex justify-center gap-1 pt-2">
              No account?
              <a
                href="/signup"
                className="text-blue-700 hover:underline"
                onClick={(event) => {
                  event.preventDefault();
                  navigate("/signup");
                }}
              >
                Signup
              </a>
            </span>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
