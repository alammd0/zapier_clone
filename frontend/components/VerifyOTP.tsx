"use client";

import { VerifyOTPBackend } from "@/lib/api/auth";
import { useState } from "react";
import OTPInput from "react-otp-input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


export default function VerifyOTP() {

    const [otp, setOtp] = useState("");
    const router = useRouter();

    async function handleSubmit() {
        try{
            const response = await VerifyOTPBackend({otp});

            toast.success(response.message);
            setOtp("");
            router.push("/login");
        }
        catch(e : any){
            toast.error(e.message)
        }
    }

    return (
        <div className="flex flex-col justify-center items-center w-full min-h-screen">
            <div className="flex flex-col gap-1 mx-auto">
               <p className="text-xl/normal font-semibold">
                    OTP<sup className="text-red-600">*</sup> :
                </p>
                 <OTPInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    inputStyle={{
                        width: "50px",
                        fontSize: "2rem",
                        textAlign: "center",
                        margin : "5px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "2px",
                    }}
                    renderInput={(props) => <input {...props} />}
                />

                <button onClick={handleSubmit} className="bg-[#FF4F00] text-white rounded-lg p-2 hover:bg-[#FF4F00]/90 transition-all duration-200 cursor-pointer w-fit">
                    Verify OTP
                </button>
            </div>
        </div>
    )
}