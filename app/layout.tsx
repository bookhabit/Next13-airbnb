import './globals.css'
import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import Navbar from './components/navbar/Navbar'
import ClientOnly from './components/ClientOnly'
import Modal from './components/modals/Modal'

export const metadata: Metadata = {
  title: 'Airbnb',
  description: 'airbnb clone',
}

const font = Nunito({
  subsets:['latin'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <Modal isOpen={true} title='hello world' />
          <Navbar/>
        </ClientOnly>
        {children}
      </body>
    </html>
  )
}
