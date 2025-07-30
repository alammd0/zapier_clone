import { ReactNode } from "react";



export default function SecondaryBtn({children, onClick, size} : { children: ReactNode, onClick : () => void, size : string}) {
    return (
        <button onClick={onClick} className={`${size == "small" ? "px-4 py-2 rounded-4xl" : "px-4 py-2"} bg-[#FF4F00] border-2 border-white rounded-md hover:bg-[#FF4F00]/30
             text-white font-bold transition-all duration-150 hover:text-black cursor-pointer`}> 
            {children}
        </button>
    )
}