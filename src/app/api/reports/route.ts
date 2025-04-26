import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

export async function GET() {
  const csvDir = path.join(process.cwd(), "python/csv");
  const files = fs.readdirSync(csvDir).filter((file) => file.endsWith(".csv"));

  return NextResponse.json({ reports: files });
}
