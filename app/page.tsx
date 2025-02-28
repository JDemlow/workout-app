// app/page.tsx
import {
  Dumbbell,
  Footprints,
  Soup,
  Goal,
  TrendingUp,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: Dumbbell,
      title: "Strength Training",
      description:
        "Log and track your strength workouts with detailed sets, reps, and weights.",
      link: "/strength",
    },
    {
      icon: Footprints,
      title: "Cardio Sessions",
      description: "Record your cardio activities, duration, and distance.",
      link: "/cardio",
    },
    {
      icon: Soup,
      title: "Calorie Tracking",
      description: "Monitor your daily meal intake and nutritional goals.",
      link: "/calorie",
    },
    {
      icon: TrendingUp,
      title: "Progress Dashboard",
      description: "Visualize your fitness journey with interactive charts.",
      link: "/progress",
    },
  ];

  const quickStats = [
    {
      icon: Goal,
      title: "Personal Goals",
      description: "Set and track your fitness objectives",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Visualize your fitness journey",
    },
    {
      icon: ClipboardList,
      title: "Comprehensive Logging",
      description: "All-in-one fitness tracking",
    },
  ];

  return (
    <div className="bg-[#C7F9CC] min-h-full">
      <div className="max-w-md mx-auto p-6">
        <div className="bg-gradient-to-r from-[#57CC99] to-[#38A3A5] rounded-3xl p-6 text-center text-white shadow-lg mb-6">
          <h1 className="text-3xl font-bold mb-4">Workout Tracker</h1>
          <p className="text-white/90">
            Your comprehensive fitness companion for tracking strength, cardio,
            and nutrition.
          </p>
        </div>

        <section className="mb-6">
          <h2 className="text-2xl font-bold text-[#22577A] mb-4">
            Track Your Fitness
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.link}
                className="
                  bg-white 
                  rounded-xl 
                  p-4 
                  text-center 
                  hover:bg-[#57CC99]/10 
                  transition-colors 
                  group
                  border-2
                  border-[#22577A]/10
                  focus:ring-2
                  focus:ring-[#22577A]"
              >
                <feature.icon
                  className="
                    mx-auto 
                    mb-2 
                    text-[#22577A] 
                    group-hover:scale-110 
                    transition-transform
                    w-8 
                    h-8"
                />
                <h3 className="font-semibold text-[#22577A] mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-600">{feature.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#22577A] mb-4">
            Key Features
          </h2>
          <div className="space-y-4">
            {quickStats.map((stat) => (
              <div
                key={stat.title}
                className="
                  bg-white 
                  rounded-xl 
                  p-4 
                  flex 
                  items-center 
                  border-2
                  border-[#22577A]/10"
              >
                <stat.icon
                  className="
                    text-[#22577A] 
                    mr-4 
                    w-8 
                    h-8"
                />
                <div>
                  <h3 className="font-semibold text-[#22577A]">{stat.title}</h3>
                  <p className="text-sm text-gray-600">{stat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
