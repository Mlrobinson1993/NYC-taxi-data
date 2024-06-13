const express = require("express");
const cors = require("cors");
const { BigQuery } = require("@google-cloud/bigquery");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

const projectId = "noble-radio-426013-d5";

const bigQuery = new BigQuery({
  projectId,
});

const dataset = "bigquery-public-data.new_york";

app.get("/api/tables", async (req, res) => {
  try {
    const sqlQuery = `SELECT * FROM ${dataset}.__TABLES__ WHERE table_id LIKE 'tlc_green%' OR table_id LIKE 'tlc_yellow%'`;
    const queryResponse = await bigQuery.query(sqlQuery);
    if (!queryResponse || queryResponse[0] === undefined) {
      res.status(404).send("No tables found");
    }

    const [tables] = queryResponse;
    res.send(tables);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/api/metrics", async (req, res) => {
  const { table } = req.query;

  const bigQueryClient = new BigQuery();

  try {
    const query = `
      SELECT 
        AVG(trip_distance) as avg_trip_distance,
        MIN(trip_distance) as min_trip_distance,
        MAX(trip_distance) as max_trip_distance,
        AVG(total_amount) as avg_total_amount,
        MIN(total_amount) as min_total_amount,
        MAX(total_amount) as max_total_amount,
        COUNT(*) as total_journeys
      FROM \`${dataset}.${table}\`
    `;
    const [response] = await bigQueryClient.query({ query });

    if (!response) {
      res.status(404).send("No data found");
      return;
    }

    const metrics = {
      avg_trip_distance: response[0].avg_trip_distance ?? 0,
      min_trip_distance: response[0].min_trip_distance ?? 0,
      max_trip_distance: response[0].max_trip_distance ?? 0,
      avg_total_amount: response[0].avg_total_amount ?? 0,
      min_total_amount: response[0].min_total_amount ?? 0,
      max_total_amount: response[0].max_total_amount ?? 0,
      total_journeys: response[0].total_journeys ?? 0,
    };

    res.send(metrics);
  } catch (error) {
    console.error("Failed to fetch data", error);
    res.status(500).send(error.message);
  }
});

app.get("/api/trip-distance", async (req, res) => {
  const { table } = req.query;

  const bigQueryClient = new BigQuery();

  try {
    const query = `
      SELECT 
        AVG(trip_distance) as avg_trip_distance,
        MIN(trip_distance) as min_trip_distance,
        MAX(trip_distance) as max_trip_distance
      FROM \`${dataset}.${table}\`
    `;
    const [response] = await bigQueryClient.query({ query });

    if (!response) {
      res.status(404).send("No data found");
      return;
    }

    const tripDistanceMetrics = {
      avg: response[0].avg_trip_distance ?? 0,
      min: response[0].min_trip_distance ?? 0,
      max: response[0].max_trip_distance ?? 0,
    };

    res.send(tripDistanceMetrics);
  } catch (error) {
    console.error("Failed to fetch data", error);
    res.status(500).send(error.message);
  }
});

app.get("/api/total-amount", async (req, res) => {
  const { table } = req.query;

  const bigQueryClient = new BigQuery();

  try {
    const query = `
      SELECT 
        AVG(total_amount) as avg_total_amount,
        MIN(total_amount) as min_total_amount,
        MAX(total_amount) as max_total_amount
      FROM \`${dataset}.${table}\`
    `;
    const [response] = await bigQueryClient.query({ query });

    if (!response) {
      res.status(404).send("No data found");
      return;
    }

    const totalAmountMetrics = {
      avg: response[0].avg_total_amount ?? 0,
      min: response[0].min_total_amount ?? 0,
      max: response[0].max_total_amount ?? 0,
    };

    res.send(totalAmountMetrics);
  } catch (error) {
    console.error("Failed to fetch data", error);
    res.status(500).send(error.message);
  }
});

app.get("/api/journeys-per-month", async (req, res) => {
  const { table } = req.query;

  const bigQueryClient = new BigQuery();

  try {
    const query = `
      WITH month_data AS (
        SELECT 
          EXTRACT(YEAR FROM pickup_datetime) AS year,
          EXTRACT(MONTH FROM pickup_datetime) AS month
        FROM \`${dataset}.${table}\`
      )
      SELECT 
        year,
        month,
        COUNT(*) AS journeys_per_month
      FROM month_data
      GROUP BY year, month
      ORDER BY year, month
    `;
    const [response] = await bigQueryClient.query({ query });

    if (!response) {
      res.status(404).send("No data found");
      return;
    }

    const journeysPerMonth = response.reduce((acc, row) => {
      const monthYear = `${row.year}-${String(row.month).padStart(2, "0")}`;
      acc[monthYear] = row.journeys_per_month;
      return acc;
    }, {});

    res.send(journeysPerMonth);
  } catch (error) {
    console.error("Failed to fetch data", error);
    res.status(500).send(error.message);
  }
});

app.get("/api/total-amount-passenger-count", async (req, res) => {
  const { table } = req.query;

  const bigQueryClient = new BigQuery();

  try {
    const query = `
      SELECT 
        passenger_count,
        AVG(total_amount) AS avg_total_amount
      FROM \`${dataset}.${table}\`
      GROUP BY passenger_count
      ORDER BY passenger_count
    `;
    const [rows] = await bigQueryClient.query({ query });

    if (!rows || rows.length === 0) {
      res.status(404).send("No data found");
      return;
    }

    const data = rows.reduce((acc, row) => {
      acc[row.passenger_count] = row.avg_total_amount;
      return acc;
    }, {});

    res.send(data);
  } catch (error) {
    console.error("Failed to fetch data", error);
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
