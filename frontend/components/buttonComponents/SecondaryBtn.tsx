import { ReactNode } from "react";


export default function SecondaryBtn({children, onClick, size} : { children: ReactNode, onClick : () => void, size : string}) {
    return (
        <button onClick={onClick} className={`${size == "small" ? "px-2 py-2" : "px-2 py-2"} bg-[#FF4F00] border-2 border-white rounded-md`}>
            {children}
        </button>
    )
}