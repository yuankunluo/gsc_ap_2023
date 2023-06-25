import Footer from './component/footer'
import { Header } from './component/header'
import './globals.css'
import "primereact/resources/themes/lara-light-indigo/theme.css";     
import "primereact/resources/primereact.min.css";    
import 'primeicons/primeicons.css';
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'GSC China Annual Party 2023',
  description: 'Web Site for GSC China Annual Part 2023',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex min-h-screen flex-col items-center justify-between">
          <Header />
          <div id="content" className="py-32">
            {children}
          </div>
          <Footer />
        </main>
        </body>
 
    </html>
  )
}
