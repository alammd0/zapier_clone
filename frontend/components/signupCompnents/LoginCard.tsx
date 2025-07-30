"use client"

import { useRouter } from "next/navigation";

export default function LoginCard() {

    const router = useRouter();
    return (
        <div className="w-full flex flex-col gap-8">
            <div className="flex flex-col gap-8">
                <p className="text-4xl/normal font-semibold">AI Automation starts and scales with Zapier</p>
                <p className="text-[#5B5B5B] text-[17px]">Zapier Enterprise empowers everyone in your business to securely automate their work in minutes, not months—no coding required.</p>
            </div>

            <button className="bg-blue-800 hover:bg-blue-800/90 px-2 py-3 rounded-2xl text-white font-semibold cursor-pointer" onClick={() => router.push("/login")}>Explore Zapier Enterprise</button>
        </div>
    )
}