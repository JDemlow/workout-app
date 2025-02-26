"use client";
import { useState } from "react";

interface CardioSession {
  activity: string;
  duration: number;
  distance: number;
}

export default function CardioTracking() {
  const [activity, setActivity] = useState("");
  const [duration, setDuration] = useState("");
  const [distance, setDistance] = useState("");
  const [sessions, setSessions] = useState<CardioSession[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSession: CardioSession = {
      activity,
      duration: parseInt(duration, 10),
      distance: parseFloat(distance),
    };
    setSessions([...sessions, newSession]);
    setActivity("");
    setDuration("");
    setDistance("");
  };

  return (
    <section className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-semibold mb-4">Cardio Tracking</h2>
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
        <button
          type="submit"
          className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Log Cardio
        </button>
      </form>
      {sessions.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Logged Cardio Sessions</h3>
          <ul className="mt-2">
            {sessions.map((session, index) => (
              <li key={index} className="border-b py-2">
                <div className="font-medium">{session.activity}</div>
                <div className="text-sm text-gray-600">
                  {session.duration} minutes, {session.distance} miles
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
