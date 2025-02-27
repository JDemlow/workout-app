import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Attempting to delete entry with ID:", params.id);
    const deletedEntry = await prisma.calorieEntry.delete({
      where: { id: Number(params.id) },
    });
    return NextResponse.json(deletedEntry);
  } catch (error) {
    console.error("Error deleting calorie entry:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to delete calorie entry" },
      { status: 500 }
    );
  }
}
