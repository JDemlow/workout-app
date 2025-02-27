// app/api/cardio-sessions/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Attempting to delete cardio session with ID:", params.id);
    const deletedSession = await prisma.cardioSession.delete({
      where: { id: Number(params.id) },
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
