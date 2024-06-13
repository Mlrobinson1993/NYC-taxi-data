import React from "react";
import { ReactComponent as Spinner } from "../../assets/spinner.svg";
import "chart.js/auto";
import "./MasterChart.css";
import { Bar, Line } from "react-chartjs-2";
import { useApi } from "../../hooks/useApi";

const MasterChart = ({ type, dataEndpoint }) => {
  const { data, loading, error } = useApi(dataEndpoint);

  if (loading)
    return (
      <div className="loading-container">
        <Spinner />
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  switch (type) {
    case "bar":
      const barData = {
        labels: ["Avg", "Min", "Max"],
        datasets: [
          {
            label: "Values",
            data: [data.avg, data.min, data.max],
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      };
      return <Bar data={barData} />;
    case "line":
      const lineData = {
        labels: Object.keys(data).map((key) => key.toString()),
        datasets: [
          {
            label: "Values",
            data: Object.values(data),
            backgroundColor: "rgba(255, 159, 64, 0.6)",
            borderColor: "rgba(255, 159, 64, 1)",
            fill: false,
          },
        ],
      };
      return <Line data={lineData} />;
    default:
      return null;
  }
};

export default MasterChart;
