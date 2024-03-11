import {InfluxDBClient, Point} from '@influxdata/influxdb3-client'

const token = 'ln23LzdOyONGHADYDekcvlwL-gJ5XEIAIb39uTynULclJsyGAVK_Ia5ITvbj1MRsipsAgYTDNZaLJGWVtT9HTw=='

async function main() {
    const client = new InfluxDBClient({host: 'https://us-east-1-1.aws.cloud2.influxdata.com', token: token})

    const query = `SELECT *
    FROM "wifi_status"
    WHERE
    time >= now() - interval '7 days'
    AND
    ("datetime" IS NOT NULL)`

const rows = await client.query(query, 'Meter_Dashboard')

for await (const row of rows) {
    let datetime = row.datetime || '';
    let device = row.device

    console.log(`${datetime} ${device}`);
}

    client.close()
}

main()