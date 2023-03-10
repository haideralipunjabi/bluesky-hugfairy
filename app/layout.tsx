import Footer from "../components/footer";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicons/favicon-16x16.png"
        />
        <link
          rel="mask-icon"
          href="/favicons/safari-pinned-tab.svg"
          color="#1d4ed8"
        />
        <meta name="msapplication-TileColor" content="#1d4ed8" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body>
        <main className="min-h-screen bg-background-secondary">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
