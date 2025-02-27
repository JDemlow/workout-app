// app/api/calorie-entries/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Retrieve all calorie entries
export async function GET() {
  try {
    const entries = await prisma.calorieEntry.findMany();
    return NextResponse.json(entries);
  } catch (error) {
    console.error("Error fetching calorie entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch calorie entries" },
      { status: 500 }
    );
  }
}

// POST: Create a new calorie entry
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { meal, calories } = body;
    const newEntry = await prisma.calorieEntry.create({
      data: {
        meal,
        calories: Number(calories),
      },
    });
    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error("Error creating calorie entry:", error);
    return NextResponse.json(
      { error: "Failed to create calorie entry" },
      { status: 500 }
    );
  }
}
