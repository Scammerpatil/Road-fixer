import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const execAsync = promisify(exec);
const fileName = "pothole-detection";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const video = formData.get("video") as File;

    if (!video) {
      return NextResponse.json(
        { error: "No video file provided." },
        { status: 400 }
      );
    }

    const fileExtension = video.name.split(".").pop();
    const filePath = `python/uploads/${fileName}.${fileExtension}`;

    // Save uploaded video
    fs.writeFileSync(filePath, Buffer.from(await video.arrayBuffer()));

    // Run the Python script
    const pythonScriptPath = "python/pothole_detection.py";
    const command = `py -3.12 ${pythonScriptPath} ${filePath}`;
    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      console.error("Python Script Error:", stderr);
    }

    // Extract the generated video path from Python output
    const videoPath = stdout
      .split("\n")
      .find((line) => line.includes("Processed video saved at:"))
      ?.split("Processed video saved at: ")[1]
      ?.trim();

    if (!videoPath || !fs.existsSync(videoPath)) {
      return NextResponse.json(
        { error: "Processed video not found." },
        { status: 500 }
      );
    }

    // Read the processed video file
    const videoBuffer = fs.readFileSync(videoPath);
    const videoFileName = path.basename(videoPath);

    // Set response headers
    return new NextResponse(videoBuffer, {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="${videoFileName}"`,
      },
    });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the video." },
      { status: 500 }
    );
  }
}
