import Tick from "../icons/Tick";


export default function SignupTick({text} : {text: string}) {
    return (
        <div className="flex gap-2">
            <Tick></Tick>
            <p>{text}</p>
        </div>
    )
}