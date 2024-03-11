// app/api/data/route.js
import {InfluxDBClient, Point} from '@influxdata/influxdb3-client'

export const GET = async () => {
  try {
    const client = new InfluxDBClient({
      host: process.env.INFLUX_URL,
      token: process.env.INFLUX_TOKEN,
    });

    const query = `SELECT *
    FROM "wifi_status"
    WHERE
    time >= now() - interval '7 days'
    AND
    ("temperature" IS NOT NULL)`;

    const response = [];
    const rows = await client.query(query, process.env.INFLUX_BUCKET);
    for await (const row of rows) {
      const temperature = row.temperature || '';
      response.push({ temperature:temperature});
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response('Server Error', {
      status: 500,
    });
  }
};
