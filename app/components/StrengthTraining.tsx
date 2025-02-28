// app/components/StrengthTraining.tsx
"use client";
import { useState, useEffect } from "react";
import { Edit, Trash2, Info } from "lucide-react";

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
    <section
      className="p-4 max-w-md mx-auto"
      aria-labelledby="strength-tracker-heading"
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
            id="strength-tracker-heading"
            className="text-2xl font-bold text-white text-center"
          >
            Strength Tracker
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
            Fill out the form to log a new strength training workout
          </p>

          <div>
            <label
              htmlFor="exercise"
              className="block text-sm font-medium text-gray-800 mb-2"
            >
              Exercise
            </label>
            <input
              id="exercise"
              type="text"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              required
              aria-required="true"
              placeholder="What exercise did you do?"
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="sets"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Sets
              </label>
              <input
                id="sets"
                type="number"
                min="1"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                required
                aria-required="true"
                placeholder="Sets"
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
                htmlFor="weight"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Weight (lbs)
              </label>
              <input
                id="weight"
                type="number"
                min="0"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                aria-required="true"
                placeholder="Weight"
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
          </div>

          <div>
            <label
              htmlFor="reps"
              className="block text-sm font-medium text-gray-800 mb-2"
            >
              Reps
            </label>
            <input
              id="reps"
              type="number"
              min="1"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              required
              aria-required="true"
              placeholder="Reps"
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
            aria-label={editingId ? "Update Workout" : "Log New Workout"}
          >
            {editingId ? "Update Workout" : "Log Workout"}
          </button>
        </form>

        {loading && (
          <div className="text-center p-4 text-gray-700" aria-live="polite">
            Loading workouts...
          </div>
        )}

        {!loading && workouts.length > 0 && (
          <div
            className="divide-y divide-gray-300"
            role="list"
            aria-label="Logged Workouts"
          >
            {workouts.map((workout) => (
              <div
                key={workout.id}
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
                  <p className="font-medium text-gray-900">
                    {workout.exercise}
                  </p>
                  <p className="text-sm text-gray-700">
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
                      p-3 
                      bg-[#22577A]/10 
                      rounded-full 
                      hover:bg-[#22577A]/20 
                      active:scale-95
                      focus:ring-2
                      focus:ring-[#22577A]"
                    aria-label={`Edit workout: ${workout.exercise}`}
                  >
                    <Edit className="w-6 h-6 text-[#22577A]" />
                  </button>
                  <button
                    onClick={() => handleDelete(workout.id!)}
                    className="
                      p-3 
                      bg-red-500/10 
                      rounded-full 
                      hover:bg-red-500/20 
                      active:scale-95
                      focus:ring-2
                      focus:ring-red-500"
                    aria-label={`Delete workout: ${workout.exercise}`}
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
