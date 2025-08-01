import AppBar from "@/components/AppBar";
import ZapDrawSection from "@/components/DrawCell/ZapDrawSection";


export default function CreateZapPage(){
    
    return (
        <div>
            <AppBar />
            <div className="min-h-screen bg-[#F9F7F3]">
                <ZapDrawSection />
            </div>
        </div>
    )
}