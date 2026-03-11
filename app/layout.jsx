export const metadata = {
  title: 'PROVE - Performance Management for Remote Developers',
  description: 'Know exactly who you\'re paying for. Eliminate the 80% of work that brings nothing. Focus on the 20% that matters.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
