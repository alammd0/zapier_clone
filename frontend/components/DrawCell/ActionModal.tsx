import { metadata } from "@/app/layout";
import { useState } from "react";

type Action = {
  id: string;
  name: string;
  image: string;
  metadata: any;
};

type ActionModalProps = {
  index: number;
  setActionModal: (value: null | number) => void;
  availableItem: Action[];
  onSelect: (
    props: null | {
      name: string;
      id: string;
      image: string;
      metadata: any;
    } | null
  ) => void;
};

export default function ActionModal({
  index,
  setActionModal,
  availableItem,
  onSelect,
}: ActionModalProps) {
  const [step, setStep] = useState(0);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);

  const isTrigger = index === 1;

  console.log("")

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100/90 bg-opacity-80 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[420px] max-w-full">
        <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2 shadow-2xs shadow-gray-700/10 dark:border-neutral-700 dark:shadow-neutral-700/70">

          <h4 className="text-2xl font-semibold text-gray-900">
            {
              step === 0 ? (isTrigger ? "Select Trigger" : "Select Action")
              : step === 1 ? (isTrigger ? "Configure Trigger" : "Configure Action")
              : "Action Details"
            }
          </h4>
  
          <button
            onClick={() => {
              setActionModal(null);
              onSelect(null);
            }}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6 cursor-pointer"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-1 pt-2">
          {step === 1 && selectedAction?.name === "Email" && (
            <EmailSender
              setMetadata={(metadata: any) => {
                if (selectedAction) {
                  onSelect({
                    ...selectedAction,
                    metadata,
                  });
                }
              }}
            />
          )}

          {step === 1 && selectedAction?.name === "Solana" && (
            <SolanaSender
              setMetadata={(metadata: any) => {
                if (selectedAction) {
                  onSelect({
                    ...selectedAction,
                    metadata,
                  });
                }
              }}
            />
          )}

          {step === 0 &&
            availableItem.map((item) => (
              <div
                onClick={() => {
                  if (isTrigger) {
                    onSelect({
                      id: item.id,
                      name: item.name,
                      image: item.image,
                      metadata: item.metadata,
                    });
                  } else {
                    setStep((x) => x + 1);
                    setSelectedAction({
                      id: item.id,
                      name: item.name,
                      image: item.image,
                      metadata: item.metadata,
                    });
                  }
                }}
                key={item.id}
                className="flex items-center gap-1 mb-4 bg-gray-300/95 px-2 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer hover:bg-gray-400"
              >
                <img src={item.image} alt={item.name} width={25} height={25} />
                <div className="text-xl font-semibold">{item.name}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function EmailSender({
  setMetadata,
}: {
  setMetadata: (metadata: any) => void;
}) {
  const [senderData, setSenderData] = useState({
    email: "",
    body: "",
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-gray-500">
          Email:
        </label>
        <input
          type="text"
          className="border-1 border-gray-200 rounded-lg p-2 hover:outline-blue-600 hover:border-blue-600"
          placeholder="Email"
          value={senderData.email}
          onChange={(e) =>
            setSenderData({ ...senderData, email: e.target.value })
          }
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="body" className="text-gray-500">
          Body:
        </label>
        <textarea
          placeholder="Body"
          id="body"
          value={senderData.body}
          className="border-1 border-gray-200 rounded-lg p-2 hover:outline-blue-600 hover:border-blue-600"
          onChange={(e) =>
            setSenderData({ ...senderData, body: e.target.value })
          }
        />
      </div>

      <button onClick={() => {
        setMetadata(senderData);
        console.log("senderData", senderData);
      }} className="bg-blue-700 text-white px-4 py-2 rounded-lg">
        Set Data
      </button>

    </div>
  );
}

function SolanaSender({
  setMetadata,
}: {
  setMetadata: (metadata: any) => void;
}) {
  const [solanaData, setSolanaData] = useState({
    address: "",
    amount: 0,
  });

  console.log("solanaData", solanaData);

  return (

    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-gray-500">
          Solana Address:
        </label>
        <input
          type="text"
          placeholder="Solana Address"
          id="address"
          value={solanaData.address}
          className="border-1 border-gray-200 rounded-lg p-2 hover:outline-blue-600 hover:border-blue-600"
          onChange={(e) =>
            setSolanaData({ ...solanaData, address: e.target.value })
          }
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="body" className="text-gray-500">
          Amount:
        </label>
        <input
          type="number"
          className="border-1 border-gray-200 rounded-lg p-2 hover:outline-blue-600 hover:border-blue-600"
          value={solanaData.amount}
          placeholder="Amount"
          id="amount"
          min={0}
          step="0.01"
          onChange={(e) =>
            setSolanaData({ ...solanaData, amount: parseFloat(e.target.value) })
          }
        />
      </div>

      <button onClick={() => setMetadata(solanaData)} className="bg-blue-700 text-white px-4 py-2 rounded-lg">
        Set Data
      </button>
      
    </div>
  );
}
