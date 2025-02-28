// app/components/ProgressTracking.tsx
"use client";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Info, Calendar } from "lucide-react";

// Types for our data
interface StrengthWorkout {
  id: number;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  createdAt: string;
}

interface CardioSession {
  id: number;
  activity: string;
  duration: number;
  distance: number;
  createdAt: string;
}

interface CalorieEntry {
  id: number;
  meal: string;
  calories: number;
  createdAt: string;
}

// Helper to format dates consistently
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

// Group data by date for charting
const groupByDate = <T extends { createdAt: string }>(
  data: T[],
  valueExtractor: (item: T) => number
): { date: string; value: number }[] => {
  const groupedData: Record<string, number> = {};

  data.forEach((item) => {
    const date = formatDate(item.createdAt);
    if (!groupedData[date]) {
      groupedData[date] = 0;
    }
    groupedData[date] += valueExtractor(item);
  });

  return Object.entries(groupedData).map(([date, value]) => ({
    date,
    value,
  }));
};

export default function ProgressTracking() {
  const [strengthData, setStrengthData] = useState<StrengthWorkout[]>([]);
  const [cardioData, setCardioData] = useState<CardioSession[]>([]);
  const [calorieData, setCalorieData] = useState<CalorieEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("week");

  // Fetch all data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all three data types in parallel
        const [strengthRes, cardioRes, calorieRes] = await Promise.all([
          fetch("/api/strength-workouts"),
          fetch("/api/cardio-sessions"),
          fetch("/api/calorie-entries"),
        ]);

        // Check responses
        if (!strengthRes.ok || !cardioRes.ok || !calorieRes.ok) {
          throw new Error("Failed to fetch data");
        }

        // Parse JSON responses
        const [strengthJson, cardioJson, calorieJson] = await Promise.all([
          strengthRes.json(),
          cardioRes.json(),
          calorieRes.json(),
        ]);

        // Update state with data
        setStrengthData(strengthJson);
        setCardioData(cardioJson);
        setCalorieData(calorieJson);

        // Set initial selected exercise if data exists
        if (strengthJson.length > 0) {
          const exercises = [
            ...new Set(strengthJson.map((w: StrengthWorkout) => w.exercise)),
          ] as string[];
          if (exercises.length > 0) {
            setSelectedExercise(exercises[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Filter data based on selected time range
  const filterDataByTimeRange = <T extends { createdAt: string }>(
    data: T[]
  ): T[] => {
    if (timeRange === "all") return data;

    const now = new Date();
    const cutoffDate = new Date();

    if (timeRange === "week") {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (timeRange === "month") {
      cutoffDate.setMonth(now.getMonth() - 1);
    }

    return data.filter((item) => new Date(item.createdAt) >= cutoffDate);
  };

  // Prepare strength progress data for selected exercise
  const getStrengthProgressData = () => {
    if (!selectedExercise) return [];

    const filteredWorkouts = filterDataByTimeRange(strengthData)
      .filter((workout) => workout.exercise === selectedExercise)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

    return filteredWorkouts.map((workout) => ({
      date: formatDate(workout.createdAt),
      weight: workout.weight,
      volume: workout.sets * workout.reps * workout.weight, // Calculate total volume
    }));
  };

  // Prepare cardio data grouped by date
  const getCardioData = () => {
    const filteredCardio = filterDataByTimeRange(cardioData);

    // Group by date for distance
    const distanceByDate = groupByDate(
      filteredCardio,
      (session) => session.distance
    );

    // Group by date for duration
    const durationByDate = groupByDate(
      filteredCardio,
      (session) => session.duration
    );

    const combinedData: Array<{
      date: string;
      distance: number;
      duration: number;
    }> = [];

    // Combine both metrics into a single array for charting
    const allDates = new Set([
      ...distanceByDate.map((item) => item.date),
      ...durationByDate.map((item) => item.date),
    ]);

    Array.from(allDates).forEach((date) => {
      const distanceItem = distanceByDate.find((item) => item.date === date);
      const durationItem = durationByDate.find((item) => item.date === date);

      combinedData.push({
        date,
        distance: distanceItem?.value || 0,
        duration: durationItem?.value || 0,
      });
    });

    // Sort by date
    return combinedData.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB;
    });
  };

  // Prepare calorie data grouped by date
  const getCalorieData = () => {
    const filteredCalories = filterDataByTimeRange(calorieData);
    return groupByDate(filteredCalories, (entry) => entry.calories).sort(
      (a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateA - dateB;
      }
    );
  };

  // Get unique exercises from strength data
  const getExercises = (): string[] => {
    return [...new Set(strengthData.map((workout) => workout.exercise))];
  };

  // Calculate summary stats
  const calculateStats = () => {
    const filteredStrength = filterDataByTimeRange(strengthData);
    const filteredCardio = filterDataByTimeRange(cardioData);
    const filteredCalories = filterDataByTimeRange(calorieData);

    // Total workouts
    const totalWorkouts = filteredStrength.length;

    // Total cardio sessions
    const totalCardioSessions = filteredCardio.length;

    // Total cardio distance
    const totalDistance = filteredCardio.reduce(
      (sum, session) => sum + session.distance,
      0
    );

    // Total cardio minutes
    const totalCardioMinutes = filteredCardio.reduce(
      (sum, session) => sum + session.duration,
      0
    );

    // Total calories tracked
    const totalCalories = filteredCalories.reduce(
      (sum, entry) => sum + entry.calories,
      0
    );

    return {
      totalWorkouts,
      totalCardioSessions,
      totalDistance: totalDistance.toFixed(1),
      totalCardioMinutes,
      totalCalories,
    };
  };

  // Render charts and statistics
  return (
    <section className="max-w-4xl mx-auto px-1 sm:px-4">
      <div className="bg-[#C7F9CC] rounded-3xl overflow-hidden shadow-lg mt-2 md:mt-4">
        <div className="bg-gradient-to-r from-[#57CC99] to-[#38A3A5] p-3 md:p-4">
          <h2 className="text-xl md:text-2xl font-bold text-white text-center">
            Fitness Progress Dashboard
          </h2>
        </div>

        {error && (
          <div
            role="alert"
            className="bg-red-600 text-white p-2 text-center flex items-center justify-center text-sm"
          >
            <Info className="mr-2 w-4 h-4" aria-hidden="true" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center p-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#22577A] border-r-transparent"></div>
            <p className="mt-2 text-gray-600 text-sm">
              Loading your fitness data...
            </p>
          </div>
        ) : (
          <div className="p-3 md:p-6">
            {/* Time range selector */}
            <div className="mb-5 flex justify-center">
              <div className="grid grid-cols-3 bg-gray-100 rounded-full p-1 w-full max-w-xs">
                <button
                  onClick={() => setTimeRange("week")}
                  className={`rounded-full py-1.5 text-xs font-medium transition-colors ${
                    timeRange === "week"
                      ? "bg-[#22577A] text-white"
                      : "bg-transparent text-gray-700"
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setTimeRange("month")}
                  className={`rounded-full py-1.5 text-xs font-medium transition-colors ${
                    timeRange === "month"
                      ? "bg-[#22577A] text-white"
                      : "bg-transparent text-gray-700"
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setTimeRange("all")}
                  className={`rounded-full py-1.5 text-xs font-medium transition-colors ${
                    timeRange === "all"
                      ? "bg-[#22577A] text-white"
                      : "bg-transparent text-gray-700"
                  }`}
                >
                  All
                </button>
              </div>
            </div>

            {/* Stats Summary - Responsive and Accessible */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white p-3 rounded-xl shadow-md flex flex-col justify-between">
                <p
                  className="text-gray-500 text-xs line-clamp-1 mb-1"
                  aria-label="Workouts"
                >
                  Workouts
                </p>
                <p className="text-xl font-bold text-[#22577A] break-words">
                  {calculateStats().totalWorkouts}
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl shadow-md flex flex-col justify-between">
                <p
                  className="text-gray-500 text-xs line-clamp-1 mb-1"
                  aria-label="Cardio Sessions"
                >
                  Sessions
                </p>
                <p className="text-xl font-bold text-[#22577A] break-words">
                  {calculateStats().totalCardioSessions}
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl shadow-md flex flex-col justify-between">
                <p
                  className="text-gray-500 text-xs line-clamp-1 mb-1"
                  aria-label="Total Distance"
                >
                  Distance
                </p>
                <p className="text-xl font-bold text-[#22577A] break-words">
                  {calculateStats().totalDistance}
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl shadow-md flex flex-col justify-between">
                <p
                  className="text-gray-500 text-xs line-clamp-1 mb-1"
                  aria-label="Cardio Minutes"
                >
                  Minutes
                </p>
                <p className="text-xl font-bold text-[#22577A] break-words">
                  {calculateStats().totalCardioMinutes}
                </p>
              </div>

              <div className="bg-white p-3 rounded-xl shadow-md flex flex-col justify-between">
                <p
                  className="text-gray-500 text-xs line-clamp-1 mb-1"
                  aria-label="Total Calories"
                >
                  Calories
                </p>
                <p className="text-xl font-bold text-[#22577A] break-words">
                  {calculateStats().totalCalories}
                </p>
              </div>
            </div>

            {/* Strength Progress Chart */}
            <div className="bg-white p-4 rounded-xl shadow-sm mb-5">
              <div className="flex flex-row items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[#22577A]">
                  Strength Progress
                </h3>

                {getExercises().length > 0 ? (
                  <select
                    value={selectedExercise}
                    onChange={(e) => setSelectedExercise(e.target.value)}
                    className="p-1.5 text-xs border border-gray-200 rounded-lg bg-gray-50"
                  >
                    {getExercises().map((exercise) => (
                      <option key={exercise} value={exercise}>
                        {exercise}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-xs text-gray-500">No exercises</span>
                )}
              </div>

              {getStrengthProgressData().length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={getStrengthProgressData()}
                      margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: "12px" }} />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="weight"
                        stroke="#22577A"
                        activeDot={{ r: 8 }}
                        name="Weight (lbs)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="volume"
                        stroke="#57CC99"
                        name="Volume (sets × reps × weight)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
                  <Calendar className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-500 text-xs md:text-sm text-center px-4">
                    {selectedExercise
                      ? `No data available for ${selectedExercise} in the selected time range.`
                      : "No strength workouts recorded yet."}
                  </p>
                </div>
              )}
            </div>

            {/* Cardio Progress Chart */}
            <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm mb-6">
              <h3 className="text-base md:text-lg font-semibold text-[#22577A] mb-4">
                Cardio Progress
              </h3>

              {getCardioData().length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={getCardioData()}
                      margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: "12px" }} />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="distance"
                        stroke="#38A3A5"
                        name="Distance (miles)"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="duration"
                        stroke="#80FFDB"
                        name="Duration (minutes)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
                  <Calendar className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-500 text-xs md:text-sm text-center px-4">
                    No cardio sessions recorded in the selected time range.
                  </p>
                </div>
              )}
            </div>

            {/* Calorie Tracking Chart */}
            <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm">
              <h3 className="text-base md:text-lg font-semibold text-[#22577A] mb-4">
                Calorie Intake
              </h3>

              {getCalorieData().length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getCalorieData()}
                      margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: "12px" }} />
                      <Bar
                        dataKey="value"
                        name="Calories"
                        fill="#57CC99"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
                  <Calendar className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-500 text-xs md:text-sm text-center px-4">
                    No calorie entries recorded in the selected time range.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
