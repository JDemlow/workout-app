"use client";
import { useState } from "react";

interface CalorieEntry {
  meal: string;
  calories: number;
}

export default function CalorieTracking() {
  const [meal, setMeal] = useState("");
  const [calories, setCalories] = useState("");
  const [entries, setEntries] = useState<CalorieEntry[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: CalorieEntry = {
      meal,
      calories: parseInt(calories, 10),
    };
    setEntries([...entries, newEntry]);
    setMeal("");
    setCalories("");
  };

  return (
    <section className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-semibold mb-4">Calorie Tracking</h2>
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
            {entries.map((entry, index) => (
              <li key={index} className="border-b py-2">
                <div className="font-medium">{entry.meal}</div>
                <div className="text-sm text-gray-600">
                  {entry.calories} calories
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
