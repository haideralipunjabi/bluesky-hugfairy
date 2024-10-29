import Footer from "../components/footer";
import "./globals.css";
import Navbar from "components/navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/favicons/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicons/favicon.svg" />
        <link rel="shortcut icon" href="/favicons/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicons/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="Hugfairy" />
        <link rel="manifest" href="/favicons/site.webmanifest" />
      </head>
      <body>
        <Navbar />
        <main className="min-h-screen bg-background-primary">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
