// app/components/StrengthTraining.tsx
"use client";
import { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";

interface Workout {
  id?: number;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
}

export default function StrengthTraining() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [exercise, setExercise] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Fetch existing workouts on mount
  useEffect(() => {
    setLoading(true);
    fetch("/api/strength-workouts")
      .then((res) => res.json())
      .then((data) => {
        setWorkouts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch workouts", err);
        setError("Failed to fetch workouts");
        setLoading(false);
      });
  }, []);

  const resetForm = () => {
    setExercise("");
    setSets("");
    setReps("");
    setWeight("");
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const workoutData = {
      exercise,
      sets: Number(sets),
      reps: Number(reps),
      weight: Number(weight),
    };

    try {
      if (editingId) {
        // Update existing workout
        const response = await fetch(`/api/strength-workouts/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(workoutData),
        });

        if (!response.ok) {
          throw new Error("Failed to update workout");
        }

        const updatedWorkout = await response.json();
        setWorkouts(
          workouts.map((workout) =>
            workout.id === editingId ? updatedWorkout : workout
          )
        );
      } else {
        // Create new workout
        const response = await fetch("/api/strength-workouts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(workoutData),
        });

        if (!response.ok) {
          throw new Error("Failed to create workout");
        }

        const createdWorkout = await response.json();
        setWorkouts([...workouts, createdWorkout]);
      }

      resetForm();
    } catch (err) {
      console.error(err);
      setError(editingId ? "Error updating workout" : "Error logging workout");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/strength-workouts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete workout");
      }

      setWorkouts(workouts.filter((workout) => workout.id !== id));
    } catch (err) {
      console.error(err);
      setError("Error deleting workout");
    }
  };

  return (
    <section className="p-4 max-w-md mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <h2 className="text-2xl font-bold p-4 bg-gray-100 text-center">
          Strength Tracker
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label
              htmlFor="exercise"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Exercise
            </label>
            <input
              id="exercise"
              type="text"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              required
              placeholder="What exercise did you do?"
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
              htmlFor="sets"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Sets
            </label>
            <input
              id="sets"
              type="number"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
              required
              placeholder="Number of sets"
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
              htmlFor="reps"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Reps
            </label>
            <input
              id="reps"
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              required
              placeholder="Number of reps"
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
              htmlFor="weight"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Weight (lbs)
            </label>
            <input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
              placeholder="Weight lifted"
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
              bg-red-600 
              text-white 
              py-3 
              rounded-lg 
              hover:bg-red-700 
              transition-colors 
              text-base 
              font-semibold 
              active:scale-95"
          >
            {editingId ? "Update Workout" : "Log Workout"}
          </button>
        </form>

        {loading && (
          <div className="text-center p-4 text-gray-500">
            Loading workouts...
          </div>
        )}

        {!loading && workouts.length > 0 && (
          <div className="divide-y divide-gray-200">
            {workouts.map((workout) => (
              <div
                key={workout.id}
                className="
                  flex 
                  justify-between 
                  items-center 
                  p-4 
                  hover:bg-gray-50 
                  transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {workout.exercise}
                  </p>
                  <p className="text-sm text-gray-500">
                    {workout.sets} sets x {workout.reps} reps @ {workout.weight}{" "}
                    lbs
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingId(workout.id!);
                      setExercise(workout.exercise);
                      setSets(workout.sets.toString());
                      setReps(workout.reps.toString());
                      setWeight(workout.weight.toString());
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
                    onClick={() => handleDelete(workout.id!)}
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
