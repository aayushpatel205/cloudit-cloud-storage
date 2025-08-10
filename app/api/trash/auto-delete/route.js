import deleteOldTrash from "@/service/DeleteOldTrash";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await deleteOldTrash();
    return NextResponse.json({ message: "Trash cleaned up successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
