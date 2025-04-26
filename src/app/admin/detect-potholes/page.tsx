"use client";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

const DetectPothole = () => {
  const [video, setVideo] = useState<File | null>(null);
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(
    null
  );

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setVideo(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!video) {
      toast.error("Please select a video to submit.");
      return;
    }

    const formData = new FormData();
    formData.append("video", video);

    try {
      toast.loading("Processing video...", { id: "video-processing" });

      const response = await axios.post("/api/pothole-detection", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "blob", // Receive the processed video as binary data
      });

      const videoBlob = new Blob([response.data], { type: "video/mp4" });
      const videoUrl = URL.createObjectURL(videoBlob);
      setProcessedVideoUrl(videoUrl);

      toast.success("Video processed successfully!", {
        id: "video-processing",
      });
    } catch (error) {
      console.error("Error processing video:", error);
      toast.error("An error occurred while processing the video.");
    }
  };

  return (
    <>
      <h2 className="text-4xl font-bold uppercase text-center mb-4">
        Pothole Detection
      </h2>
      <div className="card w-full max-w-lg shadow-xl bg-base-200 mx-auto my-auto">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="form-control gap-4">
            <div>
              <label className="label">
                <span className="label-text">Upload Video</span>
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="file-input file-input-bordered w-full"
              />
            </div>

            {video && (
              <div className="alert alert-info shadow-lg">
                <div>
                  <span>Selected Video: {video.name}</span>
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary w-full">
              Submit Video
            </button>
          </form>
        </div>
      </div>
      {processedVideoUrl && (
        <div className="w-full shadow-xl bg-base-200 p-4 rounded-lg mt-5 mx-auto">
          <h2 className="text-4xl font-bold uppercase text-center mb-4">
            Processed Video
          </h2>
          <video
            controls
            autoPlay
            loop
            className="rounded-lg w-full h-auto"
            src={processedVideoUrl}
          />
        </div>
      )}
    </>
  );
};

export default DetectPothole;
