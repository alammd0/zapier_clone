"use client";

import Delete from "../icons/Delete";
import Plus from "../icons/Plus";
import { useRouter } from "next/navigation";
import ZapHistory from "./ZapHistory";
import { useEffect, useState } from "react";
import { getZaps } from "@/lib/api/zap";

export default function ZapHeading() {

    const router = useRouter();

    const [zaps, setZaps] = useState([]);

    useEffect( () => {
        const fetchZapData = async () => {
           try{
               const response = await getZaps(); 
               setZaps(response.zaps);
           }
           catch(e){
               console.error(e);
           }
        }

        fetchZapData();
    }, []);

    console.log("Zaps", zaps);



  return (
    <div className="w-10/12 mx-auto items-center mt-8">
      <div className="flex justify-between items-center py-3 border-b border-r-gray-200 shadow-2xs">
        <h2 className="text-2xl font-bold">Zaps</h2>

        <div className="flex gap-4 items-center">
          <button 
             className="text-blue-600 flex items-center gap-1 justify-center cursor-pointer text-2xl"
          > <Delete /> Trash</button>

          <button className="bg-blue-700 flex items-center gap-1 justify-center px-4 py-2 rounded-lg text-white cursor-pointer" onClick={() => router.push("/zaps/create-zap")}> <Plus /> Create</button>
        </div>
      </div>

      <div>
         <ZapHistory zaps={zaps} />
      </div>
    </div>
  );
}
