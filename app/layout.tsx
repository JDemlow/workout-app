// app/layout.tsx
import "./globals.css";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Workout Tracker",
  description: "Track workouts, cardio, and calories",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-blue-200 p-4">
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/strength">Strength</Link>
              </li>
              <li>
                <Link href="/cardio">Cardio</Link>
              </li>
              <li>
                <Link href="/calorie">Calorie</Link>
              </li>
            </ul>
          </nav>
        </header>

        <main>{children}</main>

        <footer className="bg-blue-200 p-4 text-center">
          <p>© 2025 My Workout App</p>
        </footer>
      </body>
    </html>
  );
}
