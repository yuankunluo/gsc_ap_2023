import Link from "next/link";

export default function Home() {

  const menus = [
    // {
    //   title: "我的坐席",
    //   supTitle: "My Seat.",
    //   route: "/seat"
    // },
    // {
    //   title: "签到",
    //   supTitle: "Check In.",
    //   route: "/check-in"
    // },
    // {
    //   title: "转让坐席",
    //   supTitle: "Transfer.",
    //   route: "/switch"
    // },
    // {
    //   title: "节目单",
    //   supTitle: "Playlist.",
    //   route: "/menu"
    // },
    {
      title: "DgLovin空间",
      supTitle: "Welcome",
      route: "/"
    },
    // {
    //   title: "管理",
    //   supTitle: "Admin.",
    //   route: "/admin"
    // }
  ]
  

  return (
      <div>
        {menus.map(menu => {
          return <div key={menu.route} className="group w-64 rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:text-fuchsia-600 hover:bg-[url('/girl.png')]">
          <Link href={menu.route}>
            <h2 className={`mb-3 text-2xl font-semibold`}>
              {menu.title}{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              {menu.supTitle}
            </p>
          </Link>
        </div>
        })}
      </div>
  )
}
