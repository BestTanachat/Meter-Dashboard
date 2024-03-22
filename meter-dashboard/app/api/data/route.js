// app/api/data/route.js
// import {InfluxDBClient} from '@influxdata/influxdb3-client'

// export const GET = async () => {
//   try {
//     const client = new InfluxDBClient({
//       host: "https://us-east-1-1.aws.cloud2.influxdata.com",
//       token: process.env.INFLUX_TOKEN,
//     });

//     const query = `SELECT *
//     FROM "wifi_status"
//     WHERE
//     time >= now() - interval '7 days'
//     AND
//     ("temperature" IS NOT NULL)`;

//     const response = [];
//     const rows = await client.query(query, 'Meter_Dashboard');
//     for await (const row of rows) {
//       const temperature = row.temperature || '';
//       response.push({ temperature:temperature});
//     }

//     client.close()

//     return new Response(JSON.stringify(response), {
//       status: 200,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     return new Response(error, {
//       status: 500,
//     });
//   }
// };

// app/api/data/route.js
import { InfluxDB } from "@influxdata/influxdb-client";

export const GET = async (request) => {
  try {
    const influxDB = new InfluxDB({
      url: process.env.INFLUX_URL,
      token: process.env.INFLUX_TOKEN,
    });
    const queryApi = influxDB.getQueryApi(process.env.INFLUX_ORG);
    const query1 = `
    from(bucket: "${process.env.INFLUX_BUCKET}")
    |> range(start: -30d)
    |> filter(fn: (r) => r._field == "temperature")
  `;

    const rows1 = await queryApi.collectRows(query1);

    const query2 = `
    from(bucket: "${process.env.INFLUX_BUCKET}")
    |> range(start: -30d)
    |> filter(fn: (r) => r._field == "energy")
  `;

    const rows2 = await queryApi.collectRows(query2);

    const query3 = `
    from(bucket: "${process.env.INFLUX_BUCKET}")
    |> range(start: -30d)
    |> filter(fn: (r) => r._field == "power")
  `;

    const rows3 = await queryApi.collectRows(query3);

    const response = [];

    const rowsMap = new Map();

    for await (const row of rows1) {
      rowsMap.set(row._time, { temperature: row._value });
    }

    for await (const row of rows2) {
      const matchingRow = rowsMap.get(row._time);
      if (matchingRow) {
        matchingRow.energy = row._value;
        response.push(matchingRow);
      }
    }

    for await (const row of rows3) {
      const matchingRow = rowsMap.get(row._time);
      if (matchingRow) {
        matchingRow.power = row._value;
        response.push(matchingRow);
      }
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(error, {
      status: 500,
    });
  }
};
