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
import { InfluxDB } from '@influxdata/influxdb-client';

export const GET = async (request) => {
    try {
        const influxDB = new InfluxDB({
            url: process.env.INFLUX_URL,
            token: process.env.INFLUX_TOKEN,
        });
        const queryApi = influxDB.getQueryApi(process.env.INFLUX_ORG);
        const query = `
    from(bucket: "${process.env.INFLUX_BUCKET}")
    |> range(start: -1d)
    |> filter(fn: (r) => r._measurement == "wifi_status")
`;


            const rows = await queryApi.collectRows(query);
            const response = [];
        
            for await (const row of rows) {
              console.log(row._value)
                    const temperature = row._value || '';
                    response.push({ temperature:temperature});
                  }

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        console.error(error);
        return new Response(error, {
            status: 500
        });
    }
};
  