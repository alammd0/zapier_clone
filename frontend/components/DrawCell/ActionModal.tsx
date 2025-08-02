import { useState } from "react";

type Action = {
  id: string;
  name: string;
  image: string;
};

type ActionModalProps = {
  index: number;
  setActionModal: (value: null | number) => void;
  availableItem: Action[];
  onSelect : (props: null | { name: string; id: string; image: string }) => void;
};

export default function ActionModal({ index, setActionModal, availableItem, onSelect}: ActionModalProps) {

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100/90 bg-opacity-80 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[420px] max-w-full">
         <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2 shadow-2xs shadow-gray-700/10 dark:border-neutral-700 dark:shadow-neutral-700/70">
            <h4 className="text-2xl font-semibold text-gray-900">
               Your Apps
            </h4>
            <button onClick={() => {
              setActionModal(null);
              onSelect(null);
            }} className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 cursor-pointer">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
               </svg>
            </button>
         </div>
         <div className="flex flex-col gap-1 pt-2">
            {
              availableItem.map( (item) => (
                <div onClick={() => onSelect(item)} key={item.id} className="flex items-center gap-1 mb-4 bg-gray-300/95 px-2 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer hover:bg-gray-400">
                  <img src={item.image} alt={item.name} width={25} height={25} />
                  <div className="text-xl font-semibold">{item.name}</div>
                </div>
              ))
            }
         </div>
      </div>
    </div>
  );
}
