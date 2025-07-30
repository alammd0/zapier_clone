import { ReactNode } from "react";

export default function PrimaryBtn({children, onClick} : { children: ReactNode, onClick : () => void}) {
    return (
        <button onClick={onClick} className="px-2 py-2 border-2 border-white rounded-md">
            {children}
        </button>
    )
}