'use client'

import Link from 'next/link'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <header className="bg-white/10 backdrop-blur-md text-white p-4">
        <nav className="container mx-auto flex justify-between items-center">
          
          <ul className="flex space-x-4">
            
          </ul>
        </nav>
      </header>
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
      <footer className="bg-white/10 backdrop-blur-md text-white p-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 Image Upload App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}