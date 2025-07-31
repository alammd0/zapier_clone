"use client";

import { usePathname, useRouter } from "next/navigation";
import PrimaryBtn from "./buttonComponents/PrimaryBtn";
import SecondaryBtn from "./buttonComponents/SecondaryBtn";
import {useState } from "react";
import { User } from "@/types";
import { toast } from "sonner";

export default function AppBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userData, setUserData] = useState<User | undefined>();

  const onLogin = pathname === "/login";
  const onSignup = pathname === "/signup";
  const onDashboard = pathname === "/dashboard";

  const token = localStorage.getItem("token");
  
  const logout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    router.push("/");
  }

  return (
    <div className="bg-[#FBFAF8] flex justify-between items-center py-2 px-10 border-b border-r-gray-200 shadow-2xs">
      <div className="text-2xl font-bold">Zapier App</div>

      <div className="flex gap-2">
        <PrimaryBtn onClick={() => router.push("/")}>
          Contact for Sales
        </PrimaryBtn>

        {token ? (
           <button onClick={logout} className="bg-[#FF4F00] text-white rounded-lg p-2 hover:bg-[#FF4F00]/90 transition-all duration-200 cursor-pointer">
               Logout 
           </button>
        ) : onLogin ? (
          <SecondaryBtn size="small" onClick={() => router.push("/signup")}>
            Sign Up
          </SecondaryBtn>
        ) : onSignup ? (
          <SecondaryBtn size="small" onClick={() => router.push("/login")}>
            Login
          </SecondaryBtn>
        ) : (
          // On all other pages, show both
          <>
            <SecondaryBtn size="small" onClick={() => router.push("/login")}>
              Login
            </SecondaryBtn>
            <SecondaryBtn size="small" onClick={() => router.push("/signup")}>
              Sign Up
            </SecondaryBtn>
          </>
        )}
      </div>
    </div>
  );
}
