import csv
import os
import cv2
import torch
from ultralytics import YOLO
import numpy as np
from datetime import datetime

# Constants
FOCAL_LENGTH = 800
class_names = ["pothole"]

# Paths
model_path = os.path.join(os.path.dirname(__file__), "model/pothole_detection.pt")
csv_dir = os.path.join(os.path.dirname(__file__), "csv")
os.makedirs(csv_dir, exist_ok=True)

# Load models
model = YOLO(model=model_path, task="detect")
model_type = "DPT_Hybrid"
midas = torch.hub.load("intel-isl/MiDaS", model=model_type, pretrained=True)
midas_transforms = torch.hub.load("intel-isl/MiDaS", "transforms").small_transform
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
midas.to(device).eval()

def calculate_real_dimensions(pixel_width, pixel_height, depth_cm):
    real_width = (pixel_width * depth_cm) / FOCAL_LENGTH
    real_height = (pixel_height * depth_cm) / FOCAL_LENGTH
    return real_width, real_height

def live_pothole_detection():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error opening the camera.")
        return

    csv_path = os.path.join(csv_dir, f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_potholes_live.csv")
    with open(csv_path, mode="w", newline="") as csv_file:
        csv_writer = csv.writer(csv_file)
        csv_writer.writerow(["Pothole ID", "Length (cm)", "Breadth (cm)", "Volume (m^3)", "Depth (cm)", "Timestamp"])

        pothole_id = 0
        print("Press 'q' to stop the live detection.")

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                print("Error capturing frame.")
                break

            results = model(frame)
            annotated_frame = frame.copy()

            for result in results:
                for box in result.boxes:
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    class_id = int(box.cls[0])
                    class_name = class_names[class_id] if class_id < len(class_names) else "Unknown"

                    if x1 < 0 or y1 < 0 or x2 > frame.shape[1] or y2 > frame.shape[0] or x1 >= x2 or y1 >= y2:
                        continue

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
                    timestamp = datetime.now().strftime('%H:%M:%S')
                    csv_writer.writerow([pothole_id, length_cm, breadth_cm, volume_m3, avg_depth_cm, timestamp])

                    cv2.rectangle(annotated_frame, (x1, y1), (x2, y2), (0, 255, 255), 2)
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

            cv2.imshow("Live Pothole Detection", annotated_frame)

            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

    cap.release()
    cv2.destroyAllWindows()
    print(f"Live detection completed. Results saved to {csv_path}")

if __name__ == "__main__":
    live_pothole_detection()
