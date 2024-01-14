import ThreadLink from '@/components/threadLink'

export default async function Index() {

  return (
    <div className="flex-1 w-full flex flex-col items-center">
      <h1 className="text-3xl font-bold pt-6 pb-10">リアルタイムチャットアプリ</h1>
      <ul>
        <ThreadLink channelName='thread1' linkName='スレッド1'></ThreadLink>
        <ThreadLink channelName='thread2' linkName='スレッド2'></ThreadLink>
        <ThreadLink channelName='thread3' linkName='スレッド3'></ThreadLink>
        <ThreadLink channelName='thread4' linkName='スレッド4'></ThreadLink>
        <ThreadLink channelName='thread5' linkName='スレッド5'></ThreadLink>
      </ul>
    </div>
  )
}
