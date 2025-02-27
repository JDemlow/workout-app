// app/components/CalorieTracking.tsx
"use client";
import { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";

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
  const [editingId, setEditingId] = useState<number | null>(null);

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

  const resetForm = () => {
    setMeal("");
    setCalories("");
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const entryData = {
      meal,
      calories: Number(calories),
    };

    try {
      if (editingId) {
        // Update existing entry
        const response = await fetch(`/api/calorie-entries/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entryData),
        });

        if (!response.ok) {
          throw new Error("Failed to update calorie entry");
        }

        const updatedEntry = await response.json();
        setEntries(
          entries.map((entry) =>
            entry.id === editingId ? updatedEntry : entry
          )
        );
      } else {
        // Create new entry
        const response = await fetch("/api/calorie-entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entryData),
        });

        if (!response.ok) {
          throw new Error("Failed to create calorie entry");
        }

        const createdEntry = await response.json();
        setEntries([...entries, createdEntry]);
      }

      resetForm();
    } catch (err) {
      console.error(err);
      setError(
        editingId
          ? "Error updating calorie entry"
          : "Error logging calorie entry"
      );
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/calorie-entries/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete calorie entry");
      }

      setEntries(entries.filter((entry) => entry.id !== id));
    } catch (err) {
      console.error(err);
      setError("Error deleting calorie entry");
    }
  };

  return (
    <section className="p-4 max-w-md mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <h2 className="text-2xl font-bold p-4 bg-gray-100 text-center">
          Calorie Tracker
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label
              htmlFor="meal"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Meal Description
            </label>
            <input
              id="meal"
              type="text"
              value={meal}
              onChange={(e) => setMeal(e.target.value)}
              required
              placeholder="What did you eat?"
              className="
                w-full 
                px-4 
                py-3 
                border 
                border-gray-300 
                rounded-lg 
                focus:ring-2 
                focus:ring-blue-500 
                focus:border-transparent 
                text-base"
            />
          </div>

          <div>
            <label
              htmlFor="calories"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Calories
            </label>
            <input
              id="calories"
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              required
              placeholder="Enter calorie count"
              className="
                w-full 
                px-4 
                py-3 
                border 
                border-gray-300 
                rounded-lg 
                focus:ring-2 
                focus:ring-blue-500 
                focus:border-transparent 
                text-base"
            />
          </div>

          <button
            type="submit"
            className="
              w-full 
              bg-blue-600 
              text-white 
              py-3 
              rounded-lg 
              hover:bg-blue-700 
              transition-colors 
              text-base 
              font-semibold 
              active:scale-95"
          >
            {editingId ? "Update Meal" : "Log Meal"}
          </button>
        </form>

        {loading && (
          <div className="text-center p-4 text-gray-500">
            Loading entries...
          </div>
        )}

        {!loading && entries.length > 0 && (
          <div className="divide-y divide-gray-200">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="
                  flex 
                  justify-between 
                  items-center 
                  p-4 
                  hover:bg-gray-50 
                  transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">{entry.meal}</p>
                  <p className="text-sm text-gray-500">
                    {entry.calories} calories
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingId(entry.id!);
                      setMeal(entry.meal);
                      setCalories(entry.calories.toString());
                    }}
                    className="
                      p-2 
                      bg-blue-100 
                      rounded-full 
                      hover:bg-blue-200 
                      active:scale-95"
                  >
                    <Edit className="w-5 h-5 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id!)}
                    className="
                      p-2 
                      bg-red-100 
                      rounded-full 
                      hover:bg-red-200 
                      active:scale-95"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
