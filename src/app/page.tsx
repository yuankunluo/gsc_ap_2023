
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-40">

      <div className="fixed top-0 left-0 z-10 h-36 w-full max-w-5xl items-center justify-between bg-[url('/bg_header.png')] p-6" >
       
        <div className="flex justify-between items-end">
            <p className="text-xl">GSC 2023 AP</p>
        </div>

      </div>

      <div className="grid grid-cols-1">

        <div className="group w-64 rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:text-fuchsia-600 hover:bg-[url('/bg_header.png')]">
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              节目单{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              掌握最新节目单情报.
            </p>
          </a>
        </div>

        <div className="group w-64 rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:text-fuchsia-600 hover:bg-[url('/bg_header.png')]">
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              菜单{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              每一道菜都是精心甄选.
            </p>
          </a>
        </div>

        <div className="group w-64 rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:text-fuchsia-600 hover:bg-[url('/bg_header.png')]">
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              席位查询{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              了解您的坐席.
            </p>
          </a>
        </div>


        <div className="group w-64 rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:text-fuchsia-600 hover:bg-[url('/bg_header.png')]">
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              直播入口{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              点击进入直播.
            </p>
          </a>
        </div>
        

        

      </div>
    </main>
  )
}
