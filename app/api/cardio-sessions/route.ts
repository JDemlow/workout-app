import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Retrieve all cardio sessions
export async function GET() {
  try {
    const sessions = await prisma.cardioSession.findMany();
    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Error fetching cardio sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch cardio sessions" },
      { status: 500 }
    );
  }
}

// POST: Create a new cardio session
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { activity, duration, distance } = body;
    const newSession = await prisma.cardioSession.create({
      data: {
        activity,
        duration: Number(duration),
        distance: Number(distance),
      },
    });
    return NextResponse.json(newSession, { status: 201 });
  } catch (error) {
    console.error("Error creating cardio session:", error);
    return NextResponse.json(
      { error: "Failed to create cardio session" },
      { status: 500 }
    );
  }
}
