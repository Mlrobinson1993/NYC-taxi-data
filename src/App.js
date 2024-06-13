import React, { useState, useEffect } from "react";
import { useApi } from "./hooks/useApi";
import "./App.css";

import { ReactComponent as Spinner } from "./assets/spinner.svg";
import TripDataCharts from "./components/TripDataCharts";
import Dropdown from "./components/elements/Dropdown";

const App = () => {
  const [table, setTable] = useState();
  const {
    data: tables,
    loading: tablesLoading,
    error: tablesError,
  } = useApi("tables");

  useEffect(() => {
    if (tables?.length > 0) {
      setTable(tables[0].table_id);
    }
  }, [tables]);

  return (
    <div className="app-container">
      <div className="header-container">
        <h1>Taxi Data Charts</h1>
        {tables?.length && (
          <Dropdown
            options={tables.map((x) => x.table_id) ?? []}
            defaultVal={tables[0].table_id}
            onSelect={(option) => setTable(option)}
          />
        )}
      </div>
      {tablesLoading ? (
        <div className="loading-container">
          <Spinner />
        </div>
      ) : tablesError ? (
        <p>Error loading tables: {tablesError.message}</p>
      ) : (
        table && <TripDataCharts table={table} />
      )}
    </div>
  );
};

export default App;
