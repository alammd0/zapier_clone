"use client";

import PrimaryBtn from "./buttonComponents/PrimaryBtn";
import SecondaryBtn from "./buttonComponents/SecondaryBtn";
import { useRouter } from "next/navigation";
import Google from "./icons/Google";


export default function HeroSection() {

    const router = useRouter()

    return (
        <div className="w-11/12 mx-auto pt-20 pb-10 border-b-2 border-l-2 border-r-2 border-gray-200 shadow-2xs flex flex-col gap-10 items-center justify-center">
            <div className="text-center text-6xl font-semibold max-w-2xl flex items-center justify-center">
                The most connected AI orchestration platform
            </div>

            <div className="text-center text-xl font-normal max-w-xl flex items-center justify-center">
                Build and ship AI workflows in minutes—no IT bottlenecks, no complexity. Just results
            </div>

            <div className="flex justify-center items-center gap-4">
                <SecondaryBtn size="big"  onClick={() => router.push("/login")}>
                    Start free with email
                </SecondaryBtn>

                <PrimaryBtn onClick={() => router.push("/signup")}>
                    <p className="flex items-center gap-2 font-[16px]"><Google /> Start free with Google</p>
                </PrimaryBtn>
            </div>
        </div>
    )
}