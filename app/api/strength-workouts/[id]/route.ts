// app/api/strength-workouts/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Attempting to delete strength workout with ID:", params.id);
    const deletedWorkout = await prisma.strengthWorkout.delete({
      where: { id: Number(params.id) },
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
