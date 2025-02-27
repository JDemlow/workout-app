"use client";
import { useState, useEffect } from "react";

interface CalorieEntry {
  id?: number;
  meal: string;
  calories: number;
}

export default function CalorieTracking() {
  const [entries, setEntries] = useState<CalorieEntry[]>([]);
  const [meal, setMeal] = useState("");
  const [calories, setCalories] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing calorie entries on mount
  useEffect(() => {
    setLoading(true);
    fetch("/api/calorie-entries")
      .then((res) => res.json())
      .then((data) => {
        setEntries(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch calorie entries:", err);
        setError("Failed to fetch calorie entries");
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const newEntry: CalorieEntry = {
      meal,
      calories: Number(calories),
    };

    try {
      const response = await fetch("/api/calorie-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });
      if (!response.ok) {
        throw new Error("Failed to create calorie entry");
      }
      const createdEntry = await response.json();
      setEntries([...entries, createdEntry]);

      // Reset form fields
      setMeal("");
      setCalories("");
    } catch (err) {
      console.error(err);
      setError("Error logging calorie entry");
    }
  };

  return (
    <section className="max-w-md mx-auto p-4 bg-white shadow-md rounded my-4">
      <h2 className="text-2xl font-semibold mb-4">Calorie Tracking</h2>
      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <p>Loading entries...</p>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="meal"
                className="block text-sm font-medium text-gray-700"
              >
                Meal Description
              </label>
              <input
                id="meal"
                type="text"
                value={meal}
                onChange={(e) => setMeal(e.target.value)}
                required
                className="mt-1 block w-full rounded border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="calories"
                className="block text-sm font-medium text-gray-700"
              >
                Calories
              </label>
              <input
                id="calories"
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                required
                className="mt-1 block w-full rounded border-gray-300 shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Log Meal
            </button>
          </form>

          {entries.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold">Logged Meals</h3>
              <ul className="mt-2">
                {entries.map((entry) => (
                  <li key={entry.id} className="border-b py-2">
                    <div className="font-medium">{entry.meal}</div>
                    <div className="text-sm text-gray-600">
                      {entry.calories} calories
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  );
}
