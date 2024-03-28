import { InfluxDB } from "@influxdata/influxdb-client";


export const GET = async () => {
  try {
    const influxDB = new InfluxDB({
      url: process.env.INFLUX_URL,
      token: process.env.INFLUX_TOKEN,
    });
    const queryApi = influxDB.getQueryApi(process.env.INFLUX_ORG);
    
    const startDate = new Date()
    startDate.setDate(1)
    const endDate = new Date(startDate)
    endDate.setMonth(endDate.getMonth() + 1)

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
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(error, {
      status: 500,
    });
  }
};
