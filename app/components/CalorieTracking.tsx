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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const entryData = {
      meal,
      calories: Number(calories),
    };

    try {
      if (isEditing && editingId) {
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

        // Update the entries list with the edited entry
        setEntries(
          entries.map((entry) =>
            entry.id === editingId ? updatedEntry : entry
          )
        );

        resetForm();
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

        // Update the entries list with the new entry
        setEntries([...entries, createdEntry]);

        resetForm();
      }
    } catch (err) {
      console.error(err);
      setError(
        isEditing
          ? "Error updating calorie entry"
          : "Error logging calorie entry"
      );
    }
  };

  // Delete a calorie entry
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/calorie-entries/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete calorie entry");
      }

      // Remove the entry from state after successful deletion
      setEntries(entries.filter((entry) => entry.id !== id));

      // If we were editing this entry, reset the form
      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      console.error(err);
      setError("Error deleting calorie entry");
    }
  };

  // Start editing an entry
  const handleEdit = (entry: CalorieEntry) => {
    if (entry.id) {
      setEditingId(entry.id);
      setMeal(entry.meal);
      setCalories(entry.calories.toString());
      setIsEditing(true);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    resetForm();
  };

  return (
    <section className="max-w-md mx-auto p-4 bg-white shadow-md rounded my-4">
      <h2 className="text-2xl font-semibold mb-4">
        {isEditing ? "Edit Calorie Entry" : "Calorie Tracking"}
      </h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

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

            <div className="flex space-x-2">
              <button
                type="submit"
                className={`flex-1 py-2 px-4 ${
                  isEditing
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                } text-white rounded`}
              >
                {isEditing ? "Update Meal" : "Log Meal"}
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {entries.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold">Logged Meals</h3>
              <ul className="mt-2">
                {entries.map((entry) => (
                  <li
                    key={entry.id}
                    className="border-b py-2 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{entry.meal}</div>
                      <div className="text-sm text-gray-600">
                        {entry.calories} calories
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="text-sm text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => entry.id && handleDelete(entry.id)}
                        className="text-sm text-red-500 hover:underline"
                      >
                        Delete
                      </button>
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
