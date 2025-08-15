"use client";

import PrimaryBtn from "./buttonComponents/PrimaryBtn";
import SecondaryBtn from "./buttonComponents/SecondaryBtn";
import { useRouter } from "next/navigation";
import Google from "./icons/Google";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";



export default function HeroSection() {

    const router = useRouter()

    return (
      <div>
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
        
        <div className="w-11/12 mx-auto pt-20 pb-10 border-b-2 border-l-2 border-r-2 border-gray-200 shadow-2xs flex flex-col gap-10 items-center justify-center">
            {/* Demo Video */}
            <div> 
                <video width="1080" height="680" autoPlay loop muted className="rounded-lg border-2 border-gray-200 shadow-2xs shadow-gray-700">
                    <source src="/Zapier_Demo_Video.mp4"  type="video/mp4" />
                </video>
            </div>
        </div>

        <div className="pt-10 pb-10 border-b-2 border-l-2 border-r-2 border-gray-600 shadow-2xs">
          <div className="w-10/12 mx-auto flex items-center justify-between">
              {/* Create My Me */}
            <div className="text-center text-xl font-semibold">
                This is Design and Develop By{" "}
                    <a
                        href="https://github.com/alammd0"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1">
                        Md Khalid Alam <span style={{ color: "black" }}>❤️</span>
                    </a>
            </div>   

            {/* Add Social Icons */}
            <div className="flex items-center gap-4 text-2xl">
                <a href="https://github.com/alammd0" target="_blank" rel="noreferrer" className="hover:text-gray-600">
                    <FaGithub />
                </a>
                <a href="https://www.linkedin.com/in/md-khalid-alam-3307b4219/" target="_blank" rel="noreferrer" className="hover:text-blue-600">
                    <FaLinkedin />
                </a>
                <a href="https://x.com/MdKhalidAl11992" target="_blank" rel="noreferrer" className="hover:text-sky-500">
                    <FaXTwitter />
                </a>
            </div>
          </div>
        </div>
      </div>
    )
}