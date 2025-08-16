"use client";

import { Login, SignUp } from "@/lib/api/auth";
import { HtmlHTMLAttributes, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthForm({ type }: { type: string }) {

  const router = useRouter();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
      if (type === "signup") {
        const response = await SignUp(userData);
        console.log(response);
        if(!response.data){
          toast.error(response.message)
        }

        toast.success(response.message)
        router.push("/verify-otp")
      }
      else{
        const { email, password } = userData;

        const response = await Login({ email, password });
        console.log("response inside login", response);

        if(!response.data){
          toast.error(response.message)
        }

        localStorage.setItem("token", response.data.token);
        toast.success(response.message)
        router.push("/dashboard");
      }
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        <h1 className="text-center text-2xl/normal font-semibold">
          {type === "signup"
            ? "Create a new Account"
            : "Log in to your account"}
        </h1>

        <div className="border-2 border-gray-200 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {type === "signup" && (
              <div className="flex flex-col gap-2">
                <label className="text-sm" htmlFor="name">
                  Name <sup className="text-red-600">*</sup>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter your name"
                  required
                  className="border-1 border-gray-200 rounded-lg p-2 hover:outline-blue-600 hover:border-blue-600"
                  onChange={handleChange}
                  value={userData.name}
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-sm" htmlFor="email">
                Email <sup className="text-red-600">*</sup>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="border-1 border-gray-200 rounded-lg p-2 hover:outline-blue-600 hover:border-blue-600"
                required
                placeholder="Enter your email"
                onChange={handleChange}
                value={userData.email}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm" htmlFor="password">
                Password <sup className="text-red-600">*</sup>
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="border-1 border-gray-200 rounded-lg p-2 hover:outline-blue-600 hover:border-blue-600"
                required
                placeholder="Enter your password"
                onChange={handleChange}
                value={userData.password}
              />
            </div>

            {
              type === "login" && (
                <div className="flex justify-end text-[#f39970] text-sm hover:text-[#f39970]/80 cursor-pointer">
                  <Link href="/forgot-password">
                    Forgot Password?
                  </Link>
                </div>
              )
            }

            <button
              className="bg-[#FF4F00] text-white rounded-lg p-2 hover:bg-[#FF4F00]/90 transition-all duration-200 cursor-pointer"
              type="submit"
            >
              {type === "signup" ? "Sign Up" : "Log In"}
            </button>
          </form>

          <div className="text-center text-sm pt-4">
            {type === "signup" ? (
              <p>
                Already have an account?{" "}
                <a className="text-[#FF4F00] hover:text-blue-600" href="/login">
                  Log In
                </a>
              </p>
            ) : (
              <p className="text-gray-400">
                Don't have an account?{" "}
                <a
                  className="text-[#FF4F00] hover:text-blue-600"
                  href="/signup"
                >
                  Sign Up
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
