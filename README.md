# NYC Taxi Data App

This project visualizes NYC Taxi data using various charts.

## Prerequisites

- Node.js and npm installed
- Google Cloud SDK installed and configured
- Google Cloud project with BigQuery API enabled
- Service account credentials JSON file

## Setup Instructions

1. **Install Dependencies**

   ```sh
   npm install
   ```

2. **Set Up Google Cloud Credentials**

   - Place your service account credentials JSON file in the `credentials` directory and name it `creds.json`.
   - Ensure your service account has the necessary permissions for BigQuery.

3. **Run the Application (Server & Client) **

   ```sh
   npm start
   ```

## Endpoints

- `/api/tables`: Lists available tables.
- `/api/metrics`: Provides general metrics.
- `/api/trip-distance`: Provides average, min, max trip distances.
- `/api/total-amount`: Provides average, min, max total amounts.
- `/api/journeys-per-month`: Provides journeys per month.
- `/api/total-amount-passenger-count`: Provides total amount vs passenger count.

## Notes

Ensure that the BigQuery dataset is accessible with your service account.
