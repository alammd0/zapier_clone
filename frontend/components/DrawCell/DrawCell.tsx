

export default function DrawCell({
    name, index,
    onClick,
    image
 } : { 
     name: string,
     index: number,
     image?: string,
     onClick: () => void
 }){
    return (
        <div onClick={onClick} className="border border-gray-600 shadow-2xs rounded-lg w-[300px] px-4 py-5">
            <div className="flex justify-center items-center gap-1">
                <div className="text-2xl font-semibold">{index}.</div>
                {image && (
                    <img src={image} alt={name} width={25} height={25} />
                )}
                <div className="text-xl font-semibold">{name}</div>
            </div>
        </div>
    )
}