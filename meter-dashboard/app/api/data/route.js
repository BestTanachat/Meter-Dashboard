import { InfluxDB } from "@influxdata/influxdb-client";


export const GET = async (request) => {
  try {
    const influxDB = new InfluxDB({
      url: process.env.INFLUX_URL,
      token: process.env.INFLUX_TOKEN,
    });
    const queryApi = influxDB.getQueryApi(process.env.INFLUX_ORG);
    
    // Get the start and end dates of the current month
    const startDate = new Date();
    startDate.setDate(1); // Set the date to the 1st day of the month
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1); // Set the date to the 1st day of the next month

    const query1 = `
    from(bucket: "${process.env.INFLUX_BUCKET}")
    |> range(start: ${startDate.toISOString()}, stop: ${endDate.toISOString()})
    |> filter(fn: (r) => r._field == "temperature")
  `;

    const rows1 = await queryApi.collectRows(query1);

    const query2 = `
    from(bucket: "${process.env.INFLUX_BUCKET}")
    |> range(start: ${startDate.toISOString()}, stop: ${endDate.toISOString()})
    |> filter(fn: (r) => r._field == "energy")
  `;

    const rows2 = await queryApi.collectRows(query2);

    const query3 = `
    from(bucket: "${process.env.INFLUX_BUCKET}")
    |> range(start: ${startDate.toISOString()}, stop: ${endDate.toISOString()})
    |> filter(fn: (r) => r._field == "power")
  `;

    const rows3 = await queryApi.collectRows(query3);

    const response = [];

    const rowsMap = new Map();

    for await (const row of rows1) {
      rowsMap.set(row._time, { datetime: row._time, temperature: row._value });
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


    return new Response(JSON.stringify(response.slice(Math.round(response.length/2))), {
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
