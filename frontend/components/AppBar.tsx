"use client";

import { useRouter } from "next/navigation";
import PrimaryBtn from "./buttonComponents/Primarybtn";
import SecondaryBtn from "./buttonComponents/SecondaryBtn";


export default function AppBar() {
    const router = useRouter()
    return (
        <div className="bg-[#FBFAF8] flex justify-between items-center py-2 px-10">
            <div>
                Zapier App
            </div>

            <div className="flex gap-2">
                <PrimaryBtn onClick={() => {
                    router.push("/");
                }}>
                   Contact    
                </PrimaryBtn>

                <PrimaryBtn onClick={() => {
                    router.push("/login");
                }}> 
                    Login
                </PrimaryBtn>

                <SecondaryBtn size="small" onClick={ () => {
                    router.push("/signup");
                }} >
                    Sign Up
                </SecondaryBtn>
            </div>
        </div>
    )
}