
"use client";

import { ChangePassword } from "@/lib/api/auth";
import { useState } from "react";
import { toast } from "sonner";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function UpdatePassword() {

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); 

    const searchParams = useSearchParams()
    const token = searchParams.get('token') as string;
    // console.log("token", token);

    const router = useRouter();
    
    const updatePassword = async () => {
        try{
            const response = await ChangePassword({password, confirmPassword}, token);

            toast.success(response.message);
            router.push("/login");
            setPassword("");
            setConfirmPassword("");
        }
        catch(e : any){
            toast.error(e.message)
        }
    }


    return (
        <div>
            <div className="flex flex-col justify-center items-center w-full min-h-screen">
                <div className="flex flex-col gap-4 w-[30%] mx-auto">
                    
                    <div className="flex flex-col gap-2">
                        <label className="text-sm" htmlFor="password">Password <sup className="text-red-600">*</sup></label>
                        <input type="password" placeholder="Enter Your Password" 
                            value={password}
                            id="password"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="border-1 border-gray-200 w-full rounded-lg p-2 hover:outline-blue-600 hover:border-blue-600"
                        />
                    </div>

                     <div className="flex flex-col gap-2">
                        <label htmlFor="confirmPassword" className="text-sm">Confirm Password <sup className="text-red-600">*</sup></label>
                        <input type="password" placeholder="Enter Confirm password" 
                            value={confirmPassword}
                            id="confirmPassword"
                            name="confirmPassword"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="border-1 border-gray-200 w-full rounded-lg p-2 hover:outline-blue-600 hover:border-blue-600"
                        />
                    </div>

                    <button onClick={updatePassword} className="bg-[#FF4F00] text-white rounded-lg p-2 hover:bg-[#FF4F00]/90 transition-all duration-200 cursor-pointer w-fit">
                        Change Password
                    </button>
                </div>
            </div>
        </div>
    )
}