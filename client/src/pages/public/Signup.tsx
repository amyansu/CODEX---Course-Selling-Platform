import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Footer from "@/components/Footer";
import Appbar from "@/components/Appbar";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (error) {
      console.error("Signup error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Appbar />
      <div className="flex justify-center mt-8 p-4">
        <Card className="w-full max-w-md bg-gray-900 p-4 text-white">
          <CardHeader>
            <CardTitle className="text-2xl py-2">Create your account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="name">Name</Label>
                  </div>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    className="h-11 text-base"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="email">Email</Label>
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="h-11 text-base"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
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
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-blue-600 py-5 hover:bg-blue-700 cursor-pointer"
                >
                  {loading ? "Creating account..." : "Continue"}
                </Button>
              </div>
            </form>

            <div className="flex flex-col pt-6">
              <div className="px-1 pt-1 text-sm text-gray-300">
                <p>
                  Already have an account?
                  <a className="text-blue-400 hover:underline" href="/login">
                    Log in
                  </a>
                </p>
                <p>
                  Forgot your password?
                  <a
                    className="cursor-not-allowed text-blue-400 hover:underline"
                    href="#"
                  >
                    Reset it via email
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}

export default Signup;
