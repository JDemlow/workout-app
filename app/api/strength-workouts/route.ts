// app/api/strength-workouts/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Retrieve all strength workouts
export async function GET() {
  try {
    const workouts = await prisma.strengthWorkout.findMany();
    return NextResponse.json(workouts);
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return NextResponse.json(
      { error: "Failed to fetch workouts" },
      { status: 500 }
    );
  }
}

// POST: Create a new strength workout
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { exercise, sets, reps, weight } = body;
    const newWorkout = await prisma.strengthWorkout.create({
      data: {
        exercise,
        sets: Number(sets),
        reps: Number(reps),
        weight: Number(weight),
      },
    });
    return NextResponse.json(newWorkout, { status: 201 });
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return NextResponse.json(
      { error: "Failed to create workout" },
      { status: 500 }
    );
  }
}
