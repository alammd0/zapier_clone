

export default function DrawCell({
    name, index,
    onClick
 } : { 
     name: string,
     index: number,
     onClick: () => void
 }){
    return (
        <div onClick={onClick} className="border border-gray-600 shadow-2xs rounded-lg w-[300px] px-4 py-5">
            <div className="flex justify-center items-center gap-1">
                <div className="text-2xl font-semibold">{index}.</div>
                <div className="text-xl font-semibold">{name}</div>
            </div>
        </div>
    )
}