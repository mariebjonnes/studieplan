import Link from "next/link";
import './globals.css';

export const metadata = {
  title: 'Studieplan',
  description: 'En enkel studieplan',
};

export default function RootLayout({ children }) {
  const appEnv = process.env.APP_ENV || "development";

  return (
    <html lang="sv">
      <body>
        <header>
          <strong>Studieplan</strong>
          <nav>
            <Link href="/">Veckoplan</Link>
            <Link href="/om">Om</Link>
          </nav>
          <p>Miljö: {appEnv}</p>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
