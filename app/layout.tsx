// app/layout.tsx
import "./globals.css";
import Link from "next/link";
import { Home, Dumbbell, Footprints, Soup } from "lucide-react";

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
      <body className="bg-[#C7F9CC] min-h-screen">
        <div className="max-w-md mx-auto relative min-h-screen flex flex-col">
          <header
            className="bg-gradient-to-r from-[#57CC99] to-[#38A3A5] p-4 shadow-md"
            role="banner"
          >
            <nav>
              <ul className="flex justify-between items-center">
                <li>
                  <Link
                    href="/"
                    className="
                      text-white 
                      flex 
                      items-center 
                      space-x-2 
                      hover:bg-white/20 
                      p-2 
                      rounded-xl 
                      transition-colors"
                    aria-label="Home"
                  >
                    <Home className="w-6 h-6" />
                    <span className="sr-only">Home</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/strength"
                    className="
                      text-white 
                      flex 
                      items-center 
                      space-x-2 
                      hover:bg-white/20 
                      p-2 
                      rounded-xl 
                      transition-colors"
                    aria-label="Strength Workouts"
                  >
                    <Dumbbell className="w-6 h-6" />
                    <span className="sr-only">Strength</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cardio"
                    className="
                      text-white 
                      flex 
                      items-center 
                      space-x-2 
                      hover:bg-white/20 
                      p-2 
                      rounded-xl 
                      transition-colors"
                    aria-label="Cardio Sessions"
                  >
                    <Footprints className="w-6 h-6" />
                    <span className="sr-only">Cardio</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/calorie"
                    className="
                      text-white 
                      flex 
                      items-center 
                      space-x-2 
                      hover:bg-white/20 
                      p-2 
                      rounded-xl 
                      transition-colors"
                    aria-label="Calorie Tracking"
                  >
                    <Soup className="w-6 h-6" />
                    <span className="sr-only">Calories</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </header>

          <main className="flex-grow">{children}</main>

          <footer
            className="bg-[#22577A] text-white p-4 text-center"
            role="contentinfo"
          >
            <p>© 2025 My Workout App</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
