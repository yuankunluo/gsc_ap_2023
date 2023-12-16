
export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-24">

      <div className="">
        <img
          className="dark:drop-shadow-[0_0_0.3rem_#ffffff70]"
          src="/logo.png"
          alt="Logo"
          width={180}
          height={37}
        />
      </div>

      <div className="">
        <p>Welcome to DgLovin.cn</p>
        <p>欢迎访问DgLovin的创作空间</p>
      </div>

      <div className="fixed bottom-10">
            <a href='https://beian.miit.gov.cn' target='blank'>粤ICP备2023088361号-1</a>
      </div>
    </main>
  )
}
