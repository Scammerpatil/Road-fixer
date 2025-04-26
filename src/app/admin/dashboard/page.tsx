"use client";
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AlertTriangle, FileText, Wrench } from "lucide-react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  // State to hold the data
  const [dashboardData, setDashboardData] = useState({
    totalPotholesDetected: 120,
    totalReportsGenerated: 45,
    totalRepairsCompleted: 30,
  });
  const [volumeData, setVolumeData] = useState([]);

  const CEMENT_COST_PER_M3 = 5;
  const CONCRETE_COST_PER_M3 = 10;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("/api/dashboard");
        setDashboardData({
          totalPotholesDetected: response.data.potholesDetected || 120,
          totalReportsGenerated: response.data.reportsGenerated || 45,
          totalRepairsCompleted: response.data.repairsCompleted || 30,
        });

        // Fetch volume data
        setVolumeData(response.data.volumeTotals || []);
      } catch (error) {
        toast.error("Failed to fetch dashboard data!");
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate maintenance costs
  const calculateCosts = (volume: number) => {
    const cementCost = CEMENT_COST_PER_M3;
    const concreteCost = CONCRETE_COST_PER_M3;
    const totalCost = (cementCost + concreteCost) * volume;
    return { cementCost, concreteCost, totalCost };
  };

  return (
    <>
      <h1 className="text-4xl font-bold mb-4 text-center uppercase">
        Admin Dashboard
      </h1>
      <p className="text-lg mb-6 text-center">
        Welcome to the admin dashboard. Manage pothole detection, monitor
        repairs, and generate reports from here.
      </p>

      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg flex items-center justify-between bg-accent text-accent-content">
          <AlertTriangle width={30} />
          <h2 className="text-xl font-semibold">Total Potholes Detected</h2>
          <p className="text-2xl font-bold">
            {dashboardData.totalPotholesDetected}
          </p>
        </div>
        <div className="p-4 rounded-lg flex items-center justify-between bg-accent text-accent-content">
          <FileText width={30} />
          <h2 className="text-xl font-semibold">Total Reports Generated</h2>
          <p className="text-2xl font-bold">
            {dashboardData.totalReportsGenerated}
          </p>
        </div>
        <div className="p-4 rounded-lg flex items-center justify-between bg-accent text-accent-content">
          <Wrench width={30} />
          <h2 className="text-xl font-semibold">Repairs Completed</h2>
          <p className="text-2xl font-bold">
            {dashboardData.totalRepairsCompleted}
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-base-300 p-6 rounded-lg mb-6">
        <h2 className="text-3xl font-bold mb-4 text-center uppercase">
          Pothole Data Overview
        </h2>
        <div className="w-full md:w-1/2 mx-auto">
          <Pie
            data={{
              labels: [
                "Detected Potholes",
                "Reports Generated",
                "Repairs Completed",
              ],
              datasets: [
                {
                  label: "Pothole Data",
                  data: [
                    dashboardData.totalPotholesDetected,
                    dashboardData.totalReportsGenerated,
                    dashboardData.totalRepairsCompleted,
                  ],
                  backgroundColor: ["#f87171", "#60a5fa", "#34d399"],
                  borderWidth: 1,
                },
              ],
            }}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-base-300 p-6 rounded-lg">
        <h2 className="text-3xl font-bold mb-4 text-center uppercase">
          Total Volume and Costs
        </h2>
        <div className="overflow-x-auto">
          <table className="table-auto table-zebra w-full">
            <thead className="bg-accent text-accent-content">
              <tr>
                <th className="px-4 py-2 border">Report Name</th>
                <th className="px-4 py-2 border">Total Volume (m³)</th>
                <th className="px-4 py-2 border">Cement Cost (₹)</th>
                <th className="px-4 py-2 border">Concrete Cost (₹)</th>
                <th className="px-4 py-2 border">Total Maintenance Cost (₹)</th>
              </tr>
            </thead>
            <tbody>
              {volumeData.map(({ fileName, totalVolume }, index) => {
                const { cementCost, concreteCost, totalCost } =
                  calculateCosts(totalVolume);
                return (
                  <tr key={index}>
                    <td className="border px-4 py-2">{fileName}</td>
                    <td className="border px-4 py-2">
                      {totalVolume.toFixed(2)}
                    </td>
                    <td className="border px-4 py-2">
                      ₹ {cementCost.toFixed(2)} per m³
                    </td>
                    <td className="border px-4 py-2">
                      ₹ {concreteCost.toFixed(2)} per m³
                    </td>
                    <td className="border px-4 py-2">
                      ₹{totalCost.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
