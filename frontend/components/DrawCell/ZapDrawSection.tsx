"use client";

import { useState } from "react";
import DrawCell from "./DrawCell";
import ActionModal from "./ActionModal";

export default function ZapDrawSection() {
  const [selectTrigger, setSelectTrigger] = useState<{
    id: string;
    name: string;
  }>();

  const [selectAction, setSelectAction] = useState<
    {
      index: number;
      AvailableActionId: string;
      AvailableActionName: string;
    }[]
  >([]);

  const [actionModal, setActionModal] = useState<null | number>(null);

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-[#F9F7F3]">
        <div className="flex items-center justify-center w-full">
          <DrawCell
            onClick={() => {
              setActionModal(1);
            }}
            name="Trigger"
            index={1}
          />
        </div>

        <div className="flex flex-col gap-4 items-center justify-center w-full">
          {selectAction.map((action, index) => {
            return (
              <div key={index}>
                <DrawCell
                  onClick={() => {
                    setActionModal(action.index);
                  }}
                  name={
                    action.AvailableActionName
                      ? action.AvailableActionName
                      : "Action"
                  }
                  index={action.index}
                />
              </div>
            );
          })}
        </div>

        <div>
          <button
            onClick={() => {
              setSelectAction((a) => [
                ...a,
                {
                  index: a.length + 2,
                  AvailableActionId: "",
                  AvailableActionName: "",
                },
              ]);
            }}
            className="bg-blue-700 flex items-center gap-1 justify-center px-4 py-2 rounded-lg text-white cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>

      {actionModal !== null && <ActionModal/>}
    </div>
  );
}
