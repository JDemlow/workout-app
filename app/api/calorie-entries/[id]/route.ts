// app/api/calorie-entries/[id]/route.ts
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

    console.log("Attempting to delete calorie entry with ID:", id);

    const deletedEntry = await prisma.calorieEntry.delete({
      where: { id },
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
