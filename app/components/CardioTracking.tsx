// app/components/CardioTracking.tsx
"use client";
import { useState, useEffect } from "react";
import { Edit, Trash2, Info } from "lucide-react";

interface CardioSession {
  id?: number;
  activity: string;
  duration: number;
  distance: number;
}

export default function CardioTracking() {
  const [sessions, setSessions] = useState<CardioSession[]>([]);
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState("");
  const [distance, setDistance] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Fetch existing cardio sessions on mount
  useEffect(() => {
    setLoading(true);
    fetch("/api/cardio-sessions")
      .then((res) => res.json())
      .then((data) => {
        setSessions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch cardio sessions", err);
        setError("Failed to fetch cardio sessions");
        setLoading(false);
      });
  }, []);

  const resetForm = () => {
    setActivity("");
    setDuration("");
    setDistance("");
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const sessionData = {
      activity,
      duration: Number(duration),
      distance: Number(distance),
    };

    try {
      if (editingId) {
        // Update existing session
        const response = await fetch(`/api/cardio-sessions/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sessionData),
        });

        if (!response.ok) {
          throw new Error("Failed to update cardio session");
        }

        const updatedSession = await response.json();
        setSessions(
          sessions.map((session) =>
            session.id === editingId ? updatedSession : session
          )
        );
      } else {
        // Create new session
        const response = await fetch("/api/cardio-sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sessionData),
        });

        if (!response.ok) {
          throw new Error("Failed to create cardio session");
        }

        const createdSession = await response.json();
        setSessions([...sessions, createdSession]);
      }

      resetForm();
    } catch (err) {
      console.error(err);
      setError(
        editingId
          ? "Error updating cardio session"
          : "Error logging cardio session"
      );
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/cardio-sessions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete cardio session");
      }

      setSessions(sessions.filter((session) => session.id !== id));
    } catch (err) {
      console.error(err);
      setError("Error deleting cardio session");
    }
  };

  return (
    <section
      className="p-4 max-w-md mx-auto"
      aria-labelledby="cardio-tracker-heading"
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
            id="cardio-tracker-heading"
            className="text-2xl font-bold text-white text-center"
          >
            Cardio Tracker
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
            Fill out the form to log a new cardio session
          </p>

          <div>
            <label
              htmlFor="activity"
              className="block text-sm font-medium text-gray-800 mb-2"
            >
              Activity
            </label>
            <input
              id="activity"
              type="text"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              required
              aria-required="true"
              placeholder="What cardio activity did you do?"
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
                htmlFor="duration"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Duration (minutes)
              </label>
              <input
                id="duration"
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
                aria-required="true"
                placeholder="Minutes"
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
                htmlFor="distance"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Distance (miles)
              </label>
              <input
                id="distance"
                type="number"
                min="0"
                step="0.1"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                required
                aria-required="true"
                placeholder="Miles"
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
            aria-label={
              editingId ? "Update Cardio Session" : "Log New Cardio Session"
            }
          >
            {editingId ? "Update Session" : "Log Cardio"}
          </button>
        </form>

        {loading && (
          <div className="text-center p-4 text-gray-700" aria-live="polite">
            Loading cardio sessions...
          </div>
        )}

        {!loading && sessions.length > 0 && (
          <div
            className="divide-y divide-gray-300"
            role="list"
            aria-label="Logged Cardio Sessions"
          >
            {sessions.map((session) => (
              <div
                key={session.id}
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
                    {session.activity}
                  </p>
                  <p className="text-sm text-gray-700">
                    {session.duration} mins, {session.distance} miles
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingId(session.id!);
                      setActivity(session.activity);
                      setDuration(session.duration.toString());
                      setDistance(session.distance.toString());
                    }}
                    className="
                      p-3 
                      bg-[#22577A]/10 
                      rounded-full 
                      hover:bg-[#22577A]/20 
                      active:scale-95
                      focus:ring-2
                      focus:ring-[#22577A]"
                    aria-label={`Edit cardio session: ${session.activity}`}
                  >
                    <Edit className="w-6 h-6 text-[#22577A]" />
                  </button>
                  <button
                    onClick={() => handleDelete(session.id!)}
                    className="
                      p-3 
                      bg-red-500/10 
                      rounded-full 
                      hover:bg-red-500/20 
                      active:scale-95
                      focus:ring-2
                      focus:ring-red-500"
                    aria-label={`Delete cardio session: ${session.activity}`}
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
