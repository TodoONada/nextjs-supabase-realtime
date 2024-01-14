
"use client"
import { Database } from "@/types/supabasetype"
import { useEffect, useState } from "react"
import { supabase } from "@/utils/supabase/supabase"
import { v4 } from "uuid"
import { useSearchParams } from "next/navigation"
import ChatUI from "@/components/chats/chat"

export default function Chats() {
  const searchParams = useSearchParams()
  let channelName = searchParams.get("channel_name")!!
  const [inputText, setInputText] = useState("")
  const [inputName, setInputName] = useState("")
  const [messageText, setMessageText] = useState<Database["public"]["Tables"]["Chats"]["Row"][]>([])

  const fetchRealtimeData = () => {
    try {
      supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "Chats",
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              const { created_at, id, message, uid, channel, name } = payload.new
              setMessageText((messageText) => [...messageText, { id, created_at, message, uid, channel, name }])
            }
          }
        )
        .subscribe()

      return () => supabase.channel(channelName).unsubscribe()
    } catch (error) {
      console.error(error)
    }
  }

  // 初回のみ実行するために引数に空の配列を渡している
  useEffect(() => {
    (async () => {
      let allMessages = null
      try {
        const { data } = await supabase.from("Chats").select("*").eq('channel', channelName).order("created_at")

        allMessages = data
      } catch (error) {
        console.error(error)
      }
      if (allMessages != null) {
        setMessageText(allMessages)
      }
    })()
    fetchRealtimeData()
  }, [])

  const onSubmitNewMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (inputText === "") return
    try {
      let userID = localStorage.getItem("uid")
      if (userID == undefined) {
        userID = v4()
        localStorage.setItem("uid", userID)
      }
      let userName = "匿名"
      if (inputName !== "") {
        userName = inputName
      }
      await supabase.from("Chats").insert({ message: inputText, uid: userID, channel: channelName, name: userName })
    } catch (error) {
      console.error(error)
    }
    setInputText("")
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center p-2">
      <h1 className="text-3xl font-bold pt-5 pb-10">{channelName}</h1>
      <div className="w-full max-w-3xl mb-10 border-t-2 border-x-2">
        {messageText.map((item, index) => (
          <ChatUI chatData={item} index={index}></ChatUI>
        ))}
      </div>

      <form className="w-full max-w-md pb-10" onSubmit={onSubmitNewMessage}>
        <div className="mb-5">
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">名前（省略可）</label>
          <input type="text" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            name="name" value={inputName} onChange={(event) => setInputName(() => event.target.value)}></input>
        </div>
        <div className="mb-5">
          <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900">投稿内容</label>
          <textarea id="message" name="message" rows={4} className="block p-2.5 w-full text-sm text-gray-900
                 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="投稿内容を入力" value={inputText} onChange={(event) => setInputText(() => event.target.value)}>
          </textarea>
        </div>

        <button type="submit" disabled={inputText === ""} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center disabled:opacity-25">
          送信
        </button>
      </form>
    </div>
  )
}