"use client";

import { usePathname, useRouter } from "next/navigation";
import PrimaryBtn from "./buttonComponents/PrimaryBtn";
import SecondaryBtn from "./buttonComponents/SecondaryBtn";

export default function AppBar() {
  const pathname = usePathname() 
  const router = useRouter();

  const onLogin = pathname === "/login";
  const onSignup = pathname === "/signup";

  return (
    <div className="bg-[#FBFAF8] flex justify-between items-center py-2 px-10 border-b border-r-gray-200 shadow-2xs">
      <div className="text-2xl font-bold">Zapier App</div>

      <div className="flex gap-2">
        <PrimaryBtn onClick={() => router.push("/")}>
          Contact for Sales
        </PrimaryBtn>

        {onLogin ? (
          // If on the login page, show only Sign Up
          <SecondaryBtn size="small" onClick={() => router.push("/signup")}>
            Sign Up
          </SecondaryBtn>
        ) : onSignup ? (
          // If on the signup page, show only Login
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
