// app/api/strength-workouts/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface Params {
  id: string;
}

// Keep the existing DELETE function
export async function DELETE(
  request: Request,
  { params }: { params: Params | Promise<Params> }
) {
  try {
    // Explicitly await params to satisfy Next.js requirements
    const resolvedParams = await Promise.resolve(params);
    const idStr = resolvedParams.id;

    if (!idStr) {
      return NextResponse.json(
        { error: "Missing ID parameter" },
        { status: 400 }
      );
    }

    const id = parseInt(idStr, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    console.log("Attempting to delete strength workout with ID:", id);

    const deletedWorkout = await prisma.strengthWorkout.delete({
      where: { id },
    });

    return NextResponse.json(deletedWorkout);
  } catch (error) {
    console.error("Error deleting strength workout:", error);
    return NextResponse.json(
      {
        error: (error as Error).message || "Failed to delete strength workout",
      },
      { status: 500 }
    );
  }
}

// Add a new PUT function for updating
export async function PUT(
  request: Request,
  { params }: { params: Params | Promise<Params> }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const idStr = resolvedParams.id;

    if (!idStr) {
      return NextResponse.json(
        { error: "Missing ID parameter" },
        { status: 400 }
      );
    }

    const id = parseInt(idStr, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const data = await request.json();
    const { exercise, sets, reps, weight } = data;

    console.log("Attempting to update strength workout with ID:", id);

    const updatedWorkout = await prisma.strengthWorkout.update({
      where: { id },
      data: {
        exercise,
        sets: Number(sets),
        reps: Number(reps),
        weight: Number(weight),
      },
    });

    return NextResponse.json(updatedWorkout);
  } catch (error) {
    console.error("Error updating strength workout:", error);
    return NextResponse.json(
      {
        error: (error as Error).message || "Failed to update strength workout",
      },
      { status: 500 }
    );
  }
}
