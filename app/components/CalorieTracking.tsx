// app/components/CalorieTracking.tsx
"use client";
import { useState, useEffect } from "react";
import { Edit, Trash2, Info } from "lucide-react";

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
        console.error("Failed to fetch calorie entries", err);
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
    <section
      className="p-4 max-w-md mx-auto"
      aria-labelledby="calorie-tracker-heading"
    >
      <div
        className="bg-[#C7F9CC] rounded-3xl overflow-hidden shadow-lg"
        role="region"
        aria-live="polite"
      >
        <div
          className="bg-gradient-to-r from-[#57CC99] to-[#38A3A5] p-4"
          role="banner"
        >
          <h2
            id="calorie-tracker-heading"
            className="text-2xl font-bold text-white text-center"
          >
            Calorie Tracker
          </h2>
        </div>

        {error && (
          <div
            role="alert"
            className="bg-red-600 text-white p-3 text-center flex items-center justify-center"
          >
            <Info className="mr-2 w-5 h-5" aria-hidden="true" />
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4"
          aria-describedby="form-instructions"
        >
          <p id="form-instructions" className="sr-only">
            Fill out the form to log a new meal and its calories
          </p>

          <div>
            <label
              htmlFor="meal"
              className="block text-sm font-medium text-gray-800 mb-2"
            >
              Meal Description
            </label>
            <input
              id="meal"
              type="text"
              value={meal}
              onChange={(e) => setMeal(e.target.value)}
              required
              aria-required="true"
              placeholder="What did you eat?"
              className="
                w-full 
                px-4 
                py-3 
                border-2
                border-[#22577A]
                bg-white 
                rounded-xl 
                focus:ring-4 
                focus:ring-[#22577A] 
                focus:border-[#22577A]
                text-base
                text-gray-900
                placeholder-gray-600"
            />
          </div>

          <div>
            <label
              htmlFor="calories"
              className="block text-sm font-medium text-gray-800 mb-2"
            >
              Calories
            </label>
            <input
              id="calories"
              type="number"
              min="1"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              required
              aria-required="true"
              placeholder="Enter calorie count"
              className="
                w-full 
                px-4 
                py-3 
                border-2
                border-[#22577A]
                bg-white 
                rounded-xl 
                focus:ring-4 
                focus:ring-[#22577A] 
                focus:border-[#22577A]
                text-base
                text-gray-900
                placeholder-gray-600"
            />
          </div>

          <button
            type="submit"
            className="
              w-full 
              bg-[#22577A] 
              text-white 
              py-4 
              rounded-xl 
              hover:bg-opacity-90 
              transition-colors 
              text-base 
              font-semibold 
              active:scale-95
              focus:ring-4
              focus:ring-[#57CC99]"
            aria-label={editingId ? "Update Meal Entry" : "Log New Meal"}
          >
            {editingId ? "Update Meal" : "Log Meal"}
          </button>
        </form>

        {loading && (
          <div className="text-center p-4 text-gray-700" aria-live="polite">
            Loading meal entries...
          </div>
        )}

        {!loading && entries.length > 0 && (
          <div
            className="divide-y divide-gray-300"
            role="list"
            aria-label="Logged Meal Entries"
          >
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="
                  flex 
                  justify-between 
                  items-center 
                  p-4 
                  bg-white 
                  hover:bg-gray-50 
                  transition-colors"
                role="listitem"
              >
                <div>
                  <p className="font-medium text-gray-900">{entry.meal}</p>
                  <p className="text-sm text-gray-700">
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
                      p-3 
                      bg-[#22577A]/10 
                      rounded-full 
                      hover:bg-[#22577A]/20 
                      active:scale-95
                      focus:ring-2
                      focus:ring-[#22577A]"
                    aria-label={`Edit meal entry: ${entry.meal}`}
                  >
                    <Edit className="w-6 h-6 text-[#22577A]" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id!)}
                    className="
                      p-3 
                      bg-red-500/10 
                      rounded-full 
                      hover:bg-red-500/20 
                      active:scale-95
                      focus:ring-2
                      focus:ring-red-500"
                    aria-label={`Delete meal entry: ${entry.meal}`}
                  >
                    <Trash2 className="w-6 h-6 text-red-500" />
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
