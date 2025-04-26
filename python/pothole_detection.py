import os
import sys
import csv
import cv2
import torch
import numpy as np
from ultralytics import YOLO
from torchvision.transforms import Compose, Resize, ToTensor, Normalize
from datetime import datetime
from moviepy.video.io.ImageSequenceClip import ImageSequenceClip

model_path = os.path.join(os.path.dirname(__file__), "model/pothole_detection.pt")
output_dir = os.path.join(os.path.dirname(__file__), "output_videos")
frames_dir = os.path.join(os.path.dirname(__file__), "frames")
csv_dir = os.path.join(os.path.dirname(__file__), "csv")

os.makedirs(output_dir, exist_ok=True)
os.makedirs(frames_dir, exist_ok=True)
os.makedirs(csv_dir, exist_ok=True)

model = YOLO(model=model_path, task="detect")
midas = torch.hub.load("intel-isl/MiDaS", "DPT_Hybrid", pretrained=True)
midas_transforms = torch.hub.load("intel-isl/MiDaS", "transforms").small_transform
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
midas.to(device).eval()

class_names = ["pothole"]

FOCAL_LENGTH = 800

detected_potholes = []

def calculate_real_dimensions(pixel_width, pixel_height, depth_cm):
    """Converts pixel width/height to real-world dimensions in cm using depth and focal length."""
    real_width = (pixel_width * depth_cm) / FOCAL_LENGTH
    real_height = (pixel_height * depth_cm) / FOCAL_LENGTH
    return real_width, real_height

def detect_potholes(video_path):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Error opening video.")
        return None

    fps = int(cap.get(cv2.CAP_PROP_FPS))
    frame_count = 0

    csv_path = os.path.join(csv_dir, f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_potholes.csv")
    with open(csv_path, mode="w", newline="") as csv_file:
        csv_writer = csv.writer(csv_file)
        csv_writer.writerow(["Pothole ID", "Length (cm)", "Breadth (cm)", "Volume (m^3)", "Depth (cm)", "Timestamp"])

        pothole_id = 0
        saved_frames = []

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            frame_count += 1

            if frame_count % fps != 0:
                continue  

            results = model(frame)
            annotated_frame = frame.copy()

            for result in results:
                for box in result.boxes:
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    class_id = int(box.cls[0])
                    class_name = class_names[class_id] if class_id < len(class_names) else "Unknown"

                    pothole_center = ((x1 + x2) // 2, (y1 + y2) // 2)
                    if any(np.linalg.norm(np.array(pothole_center) - np.array(p)) < 50 for p in detected_potholes):
                        continue
                    detected_potholes.append(pothole_center)

                    cv2.rectangle(annotated_frame, (x1, y1), (x2, y2), (0, 255, 255), 2)

                    try:
                        pil_image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                        input_batch = midas_transforms(pil_image).to(device)
                        prediction = midas(input_batch)

                        prediction = torch.nn.functional.interpolate(
                            prediction.unsqueeze(1),
                            size=pil_image.shape[:2],
                            mode="bicubic",
                            align_corners=False,
                        ).squeeze()

                        depth_map = prediction.cpu().detach().numpy()

                        if y2 > depth_map.shape[0] or x2 > depth_map.shape[1]:
                            avg_depth_cm = 0
                        else:
                            depth_roi = depth_map[y1:y2, x1:x2]
                            valid_depth_values = depth_roi[depth_roi > 0]
                            
                            avg_depth_cm = (np.mean(valid_depth_values) * 2.54) / 100 if valid_depth_values.size > 0 else 0  

                    except Exception:
                        avg_depth_cm = 0

                    pixel_width = x2 - x1
                    pixel_height = y2 - y1
                    length_cm, breadth_cm = calculate_real_dimensions(pixel_width, pixel_height, avg_depth_cm)

                    area_m2 = (length_cm / 100) * (breadth_cm / 100)
                    volume_m3 = area_m2 * (avg_depth_cm / 100)

                    if np.isnan(volume_m3) or volume_m3 <= 0:
                        continue

                    pothole_id += 1
                    csv_writer.writerow([pothole_id, length_cm, breadth_cm, volume_m3, avg_depth_cm, frame_count / fps])

                    cv2.putText(
                        annotated_frame,
                        f"{class_name} - L: {length_cm:.2f}cm, B: {breadth_cm:.2f}cm, D: {avg_depth_cm:.2f}cm, V: {volume_m3:.3f}m^3",
                        (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.5,
                        (0, 255, 0),
                        1,
                        cv2.LINE_AA,
                    )

            frame_filename = os.path.join(frames_dir, f"frame_{frame_count}.jpg")
            cv2.imwrite(frame_filename, annotated_frame)
            saved_frames.append(frame_filename)

        cap.release()
        cv2.destroyAllWindows()

        output_filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_pothole_detected.mp4"
        output_path = os.path.join(output_dir, output_filename)

        clip = ImageSequenceClip(saved_frames, fps=2) 
        clip.write_videofile(output_path, codec="libx264")

        return output_path
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Please provide the video path")
    else:
        video_data = detect_potholes(sys.argv[1])
        print("Processed video saved at:",video_data)
