"use client";

import { WEB_HOOK_URL } from "@/config";
import { formatDate } from "@/lib/formatDate";
import { getZaps } from "@/types";
import { useRouter } from "next/navigation";
import { BiSolidEditAlt } from "react-icons/bi";

export default function ZapHistory({ zaps }: { zaps: getZaps[] }) {

    const router = useRouter();

  return (
    <div className="mx-auto px-4 py-6">
      <div className="w-full mx-auto overflow-x-auto">
        <table className="min-w-full cursor-pointer border border-gray-200">
          <thead className="bg-gray-100">
            <tr className="text-left text-sm font-semibold text-gray-700">
              <th className="px-4 py-2 border">Trigger Icon</th>
              <th className="px-4 py-2 border">Actions Icons</th>
              <th className="px-4 py-2 border">Created At</th>
              <th className="px-4 py-2 border">Webhook URL</th>
              <th className="px-4 py-2 border">Edit</th>
            </tr>
          </thead>
          <tbody>
            {zaps.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No Zaps created yet
                </td>
              </tr>
            ) : (
              zaps.map((zap, index) => (
                <tr key={index} className="border-t hover:bg-gray-50 text-sm">
                  <td className="px-4 py-2 border">
                    <img
                      src={zap.trigger.type.image}
                      alt={zap.trigger.type.name}
                      width={25}
                      height={25}
                    />
                  </td>
                  <td className="px-4 py-2 border flex gap-2">
                    {zap.action.map((action, idx) => (
                      <img
                        key={idx}
                        src={action.type.image}
                        alt={action.type.name}
                        width={25}
                        height={25}
                      />
                    ))}
                  </td>
                  <td className="px-4 py-2 border">{formatDate(zap.createdAt)}</td>
                  <td className="px-4 py-2 border truncate max-w-xs cursor-pointer">{`${WEB_HOOK_URL}/hooks/catch/${zap.userId}/${zap.id}`}</td>
                  <td className="px-4 py-2 border text-center">
                    <BiSolidEditAlt onClick={() => {
                        // Handle edit action
                        // router.push(`/zaps/edit/${zap.id}`);
                    }} className="inline-block text-xl cursor-pointer hover:text-blue-500" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
