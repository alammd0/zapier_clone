
"use client";

import { SendEmailBackend } from "@/lib/api/auth";
import { useState } from "react";
import { toast } from "sonner";

export default function SendEmail() {

    const [email, setEmail] = useState("");

    const SendEmail = async () => {
        try {
            const response = await SendEmailBackend(email);

            if(!response.message){
                toast.error(response.message)
            };

            toast.success(response.message);
            setEmail("");
        }
        catch(e : any){
            toast.error(e.message)
        }
    }

    return (
        <div className="flex flex-col justify-center items-center w-full min-h-screen">
            <div className="flex flex-col gap-4 w-[30%] mx-auto">
                 
                 <div className="flex flex-col gap-2">
                    <label className="text-sm">Email <sup className="text-red-600">*</sup></label>
                    <input type="text" placeholder="Enter your email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-1 border-gray-200 w-full rounded-lg p-2 hover:outline-blue-600 hover:border-blue-600"
                     />
                 </div>

                 <button onClick={SendEmail} className="bg-[#FF4F00] text-white rounded-lg p-2 hover:bg-[#FF4F00]/90 transition-all duration-200 cursor-pointer w-fit">
                    Send Email
                </button>
            </div>
        </div>
    )
}