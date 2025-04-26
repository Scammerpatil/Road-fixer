import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function GET(req: NextRequest) {
  const url = req.url;
  const report = url.slice(url.lastIndexOf("/") + 1);
  const csvPath = path.join(process.cwd(), "python/csv", report);
  if (!fs.existsSync(csvPath)) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  const data = fs
    .readFileSync(csvPath, "utf-8")
    .split("\n")
    .slice(1)
    .filter((line) => line)
    .map((line) => {
      const [id, volume, depth, timestamp] = line.split(",");
      return {
        id,
        volume: parseFloat(volume),
        depth: parseFloat(depth),
        timestamp,
      };
    });

  return NextResponse.json({ data }, { status: 200 });
}
