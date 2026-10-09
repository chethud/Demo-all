import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const authenticated = await requireAdmin();
  return NextResponse.json({ authenticated });
}
