export const metadata = {
  title: 'AutoRef - Gestión de Designaciones Arbitrales',
  description: 'Sistema profesional de gestión y asignación de árbitros deportivos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: 'Inter, sans-serif' }}>{children}</body>
    </html>
  )
}
