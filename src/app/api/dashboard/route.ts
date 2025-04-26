import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

export interface volume {
  fileName: string;
  totalVolume: number;
}

export async function GET(req: NextRequest) {
  const files = fs.readdirSync("python/csv");
  const csvFiles = files.filter((file) => file.endsWith(".csv"));
  const totalCsvFiles = csvFiles.length;

  let totalPotholesDetected = 0;
  const volumeTotals: volume[] = [];

  csvFiles.forEach((file) => {
    const data = fs.readFileSync(`python/csv/${file}`, "utf-8");
    const lines = data.split("\n");
    let fileVolumeTotal = 0;
    lines.slice(1).forEach((line) => {
      if (line.trim() === "") return;
      const columns = line.split(",");
      const volume = parseFloat(columns[1]);
      if (!isNaN(volume)) {
        fileVolumeTotal += volume;
      }
    });
    volumeTotals.push({ fileName: file, totalVolume: fileVolumeTotal });

    totalPotholesDetected += lines.length - 1;
  });

  return NextResponse.json({
    reportsGenerated: totalCsvFiles,
    potholesDetected: totalPotholesDetected,
    repairsCompleted: totalPotholesDetected,
    volumeTotals,
  });
}
