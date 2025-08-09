// pages/api/cleanup-trash.ts (Next.js Pages Router)
import { NextApiRequest, NextApiResponse } from "next";
import deleteOldTrash from "@/service/DeleteOldTrash"; // the function above
import { NextResponse } from "next/server";

export async function GET(req, res) {
  try {
    await deleteOldTrash();
    return NextResponse.json({ message: "Trash cleaned up successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
