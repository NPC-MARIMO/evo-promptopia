import '@styles/globals.css';
import Nav from '@components/Nav';
import Provider from '@components/provider';
export const metadata = {
  title: 'Promptopia',
  description: 'Discover and Share AI Prompts',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        
        <div className="main">
          <div className="gradient"/>
        </div>

        <main className="app">
          <Nav/>
          {children}
        </main>
      </body>
    </html>
  )
}
