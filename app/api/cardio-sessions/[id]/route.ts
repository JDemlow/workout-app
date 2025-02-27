// app/api/cardio-sessions/[id]/route.ts
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

    console.log("Attempting to delete cardio session with ID:", id);

    const deletedSession = await prisma.cardioSession.delete({
      where: { id },
    });

    return NextResponse.json(deletedSession);
  } catch (error) {
    console.error("Error deleting cardio session:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to delete cardio session" },
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
    const { activity, duration, distance } = data;

    console.log("Attempting to update cardio session with ID:", id);

    const updatedSession = await prisma.cardioSession.update({
      where: { id },
      data: {
        activity,
        duration: Number(duration),
        distance: Number(distance),
      },
    });

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error("Error updating cardio session:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to update cardio session" },
      { status: 500 }
    );
  }
}
