// app/api/strength-workouts/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface Params {
  id: string;
}

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
