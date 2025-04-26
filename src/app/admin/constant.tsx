import { HomeIcon, FileText, Wrench, AlertTriangle } from "lucide-react";
import { SideNavItem } from "@/types/types";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: <HomeIcon width="24" height="24" />,
  },
  {
    title: "Detect Potholes",
    path: "/admin/detect-potholes",
    icon: <AlertTriangle width="24" height="24" />,
  },
  {
    title: "Generate Reports",
    path: "/admin/generate-reports",
    icon: <FileText width="24" height="24" />,
  },
  {
    title: "Live Pothole Detection",
    path: "/admin/live-pothole-detection",
    icon: <Wrench width="24" height="24" />,
  },
];
