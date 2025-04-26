import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const pythonScriptPath = "python/live_pothole_detection.py";
    const command = `py -3.12 ${pythonScriptPath}`;

    const { stdout, stderr } = await execAsync(command);

    return NextResponse.json({
      message: "Live pothole detection started successfully!",
    });
  } catch (error) {
    console.error("Error starting live detection:", error);
    return NextResponse.json(
      { error: "Failed to start live detection." },
      { status: 500 }
    );
  }
}
