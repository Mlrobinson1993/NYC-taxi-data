import React from "react";
import MasterChart from "../MasterChart";
import "./TripDataCharts.css";

const TripDataCharts = ({ table }) => {
  return (
    <div className="trip-data-charts">
      <div className="chart-container">
        <h2>Trip Distance</h2>
        <MasterChart type="bar" dataEndpoint={`trip-distance?table=${table}`} />
      </div>
      <div className="chart-container">
        <h2>Total Amount</h2>
        <MasterChart type="bar" dataEndpoint={`total-amount?table=${table}`} />
      </div>
      <div className="chart-container">
        <h2>Journeys Per Month</h2>
        <MasterChart
          type="line"
          dataEndpoint={`journeys-per-month?table=${table}`}
        />
      </div>
      <div className="chart-container">
        <h2>Total Amount vs Passenger Count</h2>
        <MasterChart
          type="line"
          dataEndpoint={`total-amount-passenger-count?table=${table}`}
        />
      </div>
    </div>
  );
};

export default TripDataCharts;
