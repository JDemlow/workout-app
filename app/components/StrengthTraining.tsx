"use client";
import { useState, useEffect } from "react";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const newWorkout: Workout = {
      exercise,
      sets: Number(sets),
      reps: Number(reps),
      weight: Number(weight),
    };

    try {
      const response = await fetch("/api/strength-workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWorkout),
      });
      if (!response.ok) {
        throw new Error("Failed to create workout");
      }
      const createdWorkout = await response.json();
      // Update the workouts list
      setWorkouts([...workouts, createdWorkout]);

      // Reset form fields
      setExercise("");
      setSets("");
      setReps("");
      setWeight("");
    } catch (error) {
      console.error(error);
      setError("Error logging workout");
    }
  };

  // Delete a workout
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/strength-workouts/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete workout");
      }
      // Remove the workout from state after successful deletion
      setWorkouts(workouts.filter((workout) => workout.id !== id));
    } catch (err) {
      console.error(err);
      setError("Error deleting workout");
    }
  };

  return (
    <section className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-semibold mb-4">Strength Training</h2>
      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <p>Loading workouts...</p>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Form Fields */}
            <div>
              <label
                htmlFor="exercise"
                className="block text-sm font-medium text-gray-700"
              >
                Exercise
              </label>
              <input
                id="exercise"
                type="text"
                value={exercise}
                onChange={(e) => setExercise(e.target.value)}
                required
                className="mt-1 block w-full rounded border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="sets"
                className="block text-sm font-medium text-gray-700"
              >
                Sets
              </label>
              <input
                id="sets"
                type="number"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                required
                className="mt-1 block w-full rounded border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="reps"
                className="block text-sm font-medium text-gray-700"
              >
                Reps
              </label>
              <input
                id="reps"
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                required
                className="mt-1 block w-full rounded border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="weight"
                className="block text-sm font-medium text-gray-700"
              >
                Weight (lbs)
              </label>
              <input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                className="mt-1 block w-full rounded border-gray-300 shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Log Workout
            </button>
          </form>

          {/* Display Logged Workouts */}
          {workouts.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold">Logged Workouts</h3>
              <ul className="mt-2">
                {workouts.map((workout) => (
                  <li
                    key={workout.id}
                    className="border-b py-2 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{workout.exercise}</div>
                      <div className="text-sm text-gray-600">
                        {workout.sets} sets x {workout.reps} reps @{" "}
                        {workout.weight} lbs
                      </div>
                    </div>
                    <button
                      onClick={() => workout.id && handleDelete(workout.id)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Delete
                    </button>
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
