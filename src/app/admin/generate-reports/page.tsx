"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import toast from "react-hot-toast";

const GenerateReport = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState("");
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("/api/reports");
        setReports(response.data.reports);
      } catch (error) {
        toast.error("Failed to fetch reports.");
      }
    };

    fetchReports();
  }, []);

  const fetchReportData = async () => {
    if (!selectedReport) {
      toast.error("Please select a report.");
      return;
    }

    try {
      const response = await axios.get(`/api/reports/${selectedReport}`);
      setReportData(response.data.data);
      toast.success("Report data loaded.");
    } catch (error) {
      toast.error("Failed to load report data.");
    }
  };

  const generatePDF = () => {
    if (reportData.length === 0) {
      toast.error("No data available to generate the report.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Pothole Report", 10, 10);

    const tableHeaders = [
      "Pothole ID",
      "Volume (m³)",
      "Depth (m)",
      "Cement (kg)",
      "Concrete (m³)",
      "Cost (USD)",
    ];
    const tableRows = reportData.map((row: any) => {
      const cementRequired = (row.volume * 2).toFixed(2);
      const concreteRequired = row.volume.toFixed(2);
      const cost = (cementRequired * 0.1 + concreteRequired * 50).toFixed(2);

      return [
        row.id,
        row.volume.toFixed(3),
        row.depth.toFixed(2),
        cementRequired,
        concreteRequired,
        cost,
      ];
    });

    doc.autoTable({
      head: [tableHeaders],
      body: tableRows,
      startY: 20,
    });

    doc.save(`${selectedReport}_report.pdf`);
    toast.success("PDF generated successfully!");
  };

  return (
    <>
      <h1 className="text-4xl font-bold uppercase text-center mb-4">
        Generate Pothole Report
      </h1>
      <p className="text-lg mb-6 text-center mt-4">
        Select a report and generate a PDF with detailed information.
      </p>

      <div className="form-control w-full">
        <label className="label">
          <span className="text-base">Select Report</span>
        </label>
        <select
          className="select select-bordered w-full"
          value={selectedReport}
          onChange={(e) => setSelectedReport(e.target.value)}
        >
          <option value="" disabled>
            Choose a report
          </option>
          {reports.map((report) => (
            <option key={report} value={report}>
              {report}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-4 mb-6 mt-6 w-full">
        <button className={`btn btn-primary`} onClick={fetchReportData}>
          Load Report
        </button>
        <button
          className="btn btn-secondary"
          onClick={generatePDF}
          disabled={reportData.length === 0}
        >
          Generate PDF
        </button>
      </div>

      {reportData.length > 0 && (
        <div className="bg-base-300 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-center uppercase">
            Report Data
          </h2>
          <table className="table table-zebra">
            <thead className="text-base">
              <tr>
                <th>ID</th>
                <th>Volume (m³)</th>
                <th>Depth (m)</th>
                <th>Cement (kg)</th>
                <th>Concrete (m³)</th>
                <th>Cost (Rupee)</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row: any) => {
                const cementRequired = (row.volume * 2).toFixed(2);
                const concreteRequired = row.volume.toFixed(2);
                const cost = (
                  cementRequired * 0.1 +
                  concreteRequired * 50
                ).toFixed(2);

                return (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.volume.toFixed(3)}</td>
                    <td>{row.depth.toFixed(2)}</td>
                    <td>{cementRequired}</td>
                    <td>{concreteRequired}</td>
                    <td>{cost}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default GenerateReport;
