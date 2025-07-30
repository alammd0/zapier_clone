import SignupTick from "./SignupTick";


export default function Signup() {
    return (
        <div className="w-full flex flex-col gap-8">
            <div className="flex flex-col gap-8">
                <h4 className="text-4xl/normal font-semibold">AI Automation starts and scales with Zapier</h4>
                <p className="text-[#5B5B5B] text-[17px]">Orchestrate AI across your teams, tools, and processes. Turn ideas into automated action today, and power tomorrow’s business growth.</p>
            </div>

            {/* Enter Component */}
            <div className="flex flex-col gap-4">
                <SignupTick text="Integrate 8,000+ apps and 300+ AI tools without code" />
                <SignupTick text="Build AI-powered workflows in minutes, not weeks" />
                <SignupTick text="14-day trial of all premium features and apps" />
            </div>
        </div>
    )
}