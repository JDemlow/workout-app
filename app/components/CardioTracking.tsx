"use client";
import { useState, useEffect } from "react";

interface CardioSession {
  id?: number;
  activity: string;
  duration: number; // in minutes
  distance: number; // in miles
}

export default function CardioTracking() {
  const [sessions, setSessions] = useState<CardioSession[]>([]);
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState("");
  const [distance, setDistance] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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
    setIsEditing(false);
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
      if (isEditing && editingId) {
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

        // Update the sessions list with the edited session
        setSessions(
          sessions.map((session) =>
            session.id === editingId ? updatedSession : session
          )
        );

        resetForm();
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

        // Update the sessions list with the new session
        setSessions([...sessions, createdSession]);

        resetForm();
      }
    } catch (error) {
      console.error(error);
      setError(
        isEditing
          ? "Error updating cardio session"
          : "Error logging cardio session"
      );
    }
  };

  // Delete a cardio session
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/cardio-sessions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete cardio session");
      }

      // Remove the session from state after successful deletion
      setSessions(sessions.filter((session) => session.id !== id));

      // If we were editing this session, reset the form
      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      console.error(err);
      setError("Error deleting cardio session");
    }
  };

  // Start editing a session
  const handleEdit = (session: CardioSession) => {
    if (session.id) {
      setEditingId(session.id);
      setActivity(session.activity);
      setDuration(session.duration.toString());
      setDistance(session.distance.toString());
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
        {isEditing ? "Edit Cardio Session" : "Cardio Tracking"}
      </h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <p>Loading sessions...</p>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="activity"
                className="block text-sm font-medium text-gray-700"
              >
                Activity
              </label>
              <input
                id="activity"
                type="text"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                required
                className="mt-1 block w-full rounded border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-gray-700"
              >
                Duration (minutes)
              </label>
              <input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
                className="mt-1 block w-full rounded border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="distance"
                className="block text-sm font-medium text-gray-700"
              >
                Distance (miles)
              </label>
              <input
                id="distance"
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
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
                    : "bg-green-500 hover:bg-green-600"
                } text-white rounded`}
              >
                {isEditing ? "Update Session" : "Log Cardio Session"}
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

          {sessions.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold">Logged Cardio Sessions</h3>
              <ul className="mt-2">
                {sessions.map((session) => (
                  <li
                    key={session.id}
                    className="border-b py-2 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{session.activity}</div>
                      <div className="text-sm text-gray-600">
                        {session.duration} minutes, {session.distance} miles
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(session)}
                        className="text-sm text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => session.id && handleDelete(session.id)}
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
