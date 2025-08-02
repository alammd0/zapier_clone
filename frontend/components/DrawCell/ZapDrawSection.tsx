"use client";

import { useEffect, useState } from "react";
import DrawCell from "./DrawCell";
import ActionModal from "./ActionModal";
import { createZap, GetAvailableActions, GetAvailableTriggers } from "@/lib/api/zap";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ZapDrawSection() {
  const [availableAction, setAvailableAction] = useState([]);
  const [availableTrigger, setAvailableTrigger] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trigger = await GetAvailableTriggers();
        setAvailableTrigger(trigger.triggers);

        const actions = await GetAvailableActions();
        setAvailableAction(actions.actions);
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, []);

  const [selectTrigger, setSelectTrigger] = useState<{
    id: string;
    name: string;
    image: string;
  }>();

  const [actionModal, setActionModal] = useState<null | number>(null);

  const router = useRouter();
  const [selectAction, setSelectAction] = useState<
    {
      index: number;
      AvailableActionId: string;
      AvailableActionName: string;
      image?: string;
      metadata?: Record<string, any>;
    }[]
  >([]);

  // const [editZap, setEditZap] = useState([]);

  async function handleClick() {
     if (!selectTrigger) {
         console.error("No trigger selected");
         return;
     }
     try{
         const response = await createZap({
             availableTriggerId: selectTrigger.id,
             triggerMetadata: {},
             actions: selectAction.map((x) => ({
                 availableActionId :  x.AvailableActionId,
                 availableMetadata : x.metadata ?? {},
             }))
         });

         if(!response){
            toast.error(response.message);
         } 

         toast.success(response.message);
         router.push("/dashboard");
     }

     catch(e){
          console.error(e);
          toast.error("Failed to create zap");
     }
  }

  return (
    <div>
      <div className="flex items-center justify-end w-fit text-white mb-4 ml-auto pt-4 pr-4">
        <button onClick={handleClick} className="transition-colors text-lg bg-gray-500 px-4 py-2 rounded-lg  font-semibold cursor-pointer hover:text-gray-200">
          Published Zaps
        </button>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-[#F9F7F3]">
        <div className="flex items-center justify-center w-full">
          <DrawCell
            onClick={() => {
              setActionModal(1);
            }}
            name={selectTrigger ? selectTrigger.name : "Trigger"}
            image={selectTrigger ? selectTrigger.image : ""}
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
                  name={action.AvailableActionName || "Action"}
                  image={action.image || ""}
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

      {actionModal && (
        <ActionModal
          index={actionModal}
          setActionModal={setActionModal}
          availableItem={actionModal === 1 ? availableTrigger : availableAction}
          onSelect={(
            props: { name: string; id: string; image: string } | null
          ) => {
            if (props === null) {
              setActionModal(null);
              return;
            }

            if (actionModal === 1) {
              setSelectTrigger({
                id: props.id,
                name: props.name,
                image: props.image,
              });
            } else {
              setSelectAction((a) => {
                let newActions = [...a];
                if (typeof actionModal === "number") {
                  newActions[actionModal - 2] = {
                    index: actionModal,
                    AvailableActionId: props.id,
                    AvailableActionName: props.name,
                    image: props.image,
                  };
                }
                return newActions;
              });
            }
            setActionModal(null);
          }}
        />
      )}
    </div>
  );
}
