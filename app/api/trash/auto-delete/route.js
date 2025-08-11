import deleteOldTrash from "@/service/DeleteOldTrash";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await deleteOldTrash();
    return NextResponse.json({ message: response.message });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
