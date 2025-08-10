// app/api/trash/auto-delete/route.cron.js

import deleteOldTrash from "@/service/DeleteOldTrash";
import { NextResponse } from "next/server";

export const config = {
  schedule: "30 18 * * *" // 00:00 IST daily
};

export async function GET() {
  try {
    await deleteOldTrash();
    return NextResponse.json({ message: "Trash cleaned up successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
