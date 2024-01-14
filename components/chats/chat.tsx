import { Database } from "@/types/supabasetype"
import DateFormatter from "@/components/date"

type Props = {
  chatData: Database["public"]["Tables"]["Chats"]["Row"],
  index: number
}

export default function ChatUI({ chatData, index }: Props) {
  return (
    <div key={chatData.id} className="p-2 border-b-2">
      <div className="flex">
        <p className=" pr-2">{index + 1}</p>
        <h2 className="font-medium text-gray-900 truncate">{chatData.name}</h2>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500"><DateFormatter timestamp={chatData.created_at}></DateFormatter></p>
        <p className="w-32 text-sm text-gray-500 truncate">ID:{chatData.uid}</p>
      </div>
      <p className="mt-1 text-gray-600 whitespace-pre-wrap">{chatData.message}</p>
    </div>
  )
}