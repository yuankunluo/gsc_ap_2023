import Link from "next/link";

export default function Home() {

  return (
      <div>


      <div className="group w-64 rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:text-fuchsia-600 hover:bg-[url('/girl.png')]">
          <Link href="/seat">
            <h2 className={`mb-3 text-2xl font-semibold`}>
              我的坐席{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              My Seat.
            </p>
          </Link>
        </div>

        <div className="group w-64 rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:text-fuchsia-600 hover:bg-[url('/girl.png')]">
          <Link href="/check-in">
            <h2 className={`mb-3 text-2xl font-semibold`}>
              签到{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Check In.
            </p>
          </Link>
        </div>


        <div className="group w-64 rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:text-fuchsia-600 hover:bg-[url('/girl.png')]">
          <Link href="/switch">
            <h2 className={`mb-3 text-2xl font-semibold`}>
              转让坐席{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Transfer.
            </p>
          </Link>
        </div>

        <div className="group w-64 rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:text-fuchsia-600 hover:bg-[url('/girl.png')]">
          <Link href="/admin">
            <h2 className={`mb-3 text-2xl font-semibold`}>
              管理{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Admin.
            </p>
          </Link>
        </div>



        </div>
  )
}
