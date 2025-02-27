// app/components/CardioTracking.tsx
"use client";
import { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";

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
        console.error("Failed to fetch cardio sessions:", err);
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
    <section className="p-4 max-w-md mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <h2 className="text-2xl font-bold p-4 bg-gray-100 text-center">
          Cardio Tracker
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label
              htmlFor="activity"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Activity
            </label>
            <input
              id="activity"
              type="text"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              required
              placeholder="What activity did you do?"
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
              htmlFor="duration"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Duration (minutes)
            </label>
            <input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              placeholder="Enter duration"
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
              htmlFor="distance"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Distance (miles)
            </label>
            <input
              id="distance"
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              required
              placeholder="Enter distance"
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
              bg-green-600 
              text-white 
              py-3 
              rounded-lg 
              hover:bg-green-700 
              transition-colors 
              text-base 
              font-semibold 
              active:scale-95"
          >
            {editingId ? "Update Session" : "Log Cardio"}
          </button>
        </form>

        {loading && (
          <div className="text-center p-4 text-gray-500">
            Loading sessions...
          </div>
        )}

        {!loading && sessions.length > 0 && (
          <div className="divide-y divide-gray-200">
            {sessions.map((session) => (
              <div
                key={session.id}
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
                    {session.activity}
                  </p>
                  <p className="text-sm text-gray-500">
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
                      p-2 
                      bg-blue-100 
                      rounded-full 
                      hover:bg-blue-200 
                      active:scale-95"
                  >
                    <Edit className="w-5 h-5 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(session.id!)}
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
