import { ReactNode } from "react";

export default function PrimaryBtn({children, onClick} : { children: ReactNode, onClick : () => void}) {
    return (
        <button onClick={onClick} className="px-4 py-1 border-2 border-gray-500 rounded-md cursor-pointer hover:bg-[#f5f3eb]">
            {children}
        </button>
    )
}