"use client";
import React, { useState, useEffect } from "react";
import "./page.css";
import { fetchData, fetchUnit, fetchpower } from "@/lib/actions/fetchData";
import dynamic from "next/dynamic";

const GaugeComponent = dynamic(() => import("react-gauge-component"), {
  ssr: false,
});
import { LineChart } from '@mui/x-charts/LineChart';
import Button from '@mui/material/Button';
import moment from 'moment';


export default function Home() {
  const [time, setTime] = useState(new Date());
  const [temperature, setTemperature] = useState(false);
  const [status, setStatus] = useState(true)
  const [price, setPrice] = useState(0)
  const [power, setPower] = useState([])
  const [datetime, setDatetime] = useState([]) 
  const [data, setData] = useState({
    temperature: "",
    power: "",
    energy: "",
    datetime: "",
    isloading: true,
    error: null,
  });

  const getData = async () => {
    try {
      const fetch = await fetchData();
      const [max, min] = await fetchUnit();
      const arr = await fetchpower();
      setPrice((max-min)*8)
      setData({ ...fetch, datetime: moment(fetch.datetime).format('DD-MM-YYYY HH:mm:ss'), isloading: false, error: null });
      setPower(arr[0])
      setDatetime(arr[1])
      // console.log(fetch);
    } catch (err) {
      setData((prevState) => ({
        ...prevState,
        isloading: false,
        error: err.message || "Error fetching data",
      }));
    }
  };

  const isWithinTenMinutes = (datetimeString) => {
    const datetime = new Date(datetimeString);

    if (isNaN(datetime.getTime())) {
        return false; 
    }
    const now = new Date();
    now.setHours(now.getHours() + 7);
    const differenceInMilliseconds = Math.abs(datetime - now);
    const differenceInMinutes = differenceInMilliseconds / (1000 * 60);

    return differenceInMinutes <= 10;
  }

  const formattedDatetime = datetime.map(dt => moment(dt).toDate());

  useEffect(() => {
    const interval = setInterval(() => getData(), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (data.isloading) {
    return <div className="load-status">Loading...</div>;
  }

  const gaugeTemperature=(temperature)=>{
    if (temperature){
      return (
        <div className="meter-block">
                <h3>อุณหภูมิในหน่วยองศาเซลเซียส</h3>
                <GaugeComponent
                  type="semicircle"
                  arc={{
                    width: 0.2,
                    padding: 0.005,
                    cornerRadius: 1,
                    // gradient: true,
                    subArcs: [
                      {
                        limit: 15,
                        color: "#EA4228",
                        showTick: true,
                      },
                      {
                        limit: 45,
                        color: "#5BE12C",
                        showTick: true,
                      },
                      {
                        limit: 60,
                        color: "#F5CD19",
                        showTick: true,
                      },
                      {
                        color: "#EA4228",
                      },
                    ],
                  }}
                  pointer={{ type: "arrow", elastic: true }}
                  labels={{
                    valueLabel: {
                      formatTextValue: (value) => value + " ºC",
                      style: { fill: "#000" },
                    },
                    tickLabels: {
                      type: "outer",
                      valueConfig: {
                        formatTextValue: (value) => value + " ºC",
                        fontSize: 10,
                      },
                    },
                  }}
                  value={data.temperature ? data.temperature.toFixed(2) : "- "}
                  minValue={0}
                  maxValue={80}
                />
              </div>
      )
    }
    else{
      return (
        <div className="meter-block">
                <h3>อุณหภูมิในหน่วยองศาฟาเรนไฮต์</h3>
                <GaugeComponent
                  type="semicircle"
                  arc={{
                    width: 0.2,
                    padding: 0.005,
                    cornerRadius: 1,
                    // gradient: true,
                    subArcs: [
                      {
                        limit: 59,
                        color: "#EA4228",
                        showTick: true,
                      },
                      {
                        limit: 113,
                        color: "#5BE12C",
                        showTick: true,
                      },
                      {
                        limit: 140,
                        color: "#F5CD19",
                        showTick: true,
                      },
                      {
                        color: "#EA4228",
                      },
                    ],
                  }}
                  pointer={{ type: "arrow", elastic: true }}
                  labels={{
                    valueLabel: {
                      formatTextValue: (value) => value + " ºF",
                      style: { fill: "#000" },
                    },
                    tickLabels: {
                      type: "outer",
                      valueConfig: {
                        formatTextValue: (value) => value + " ºF",
                        fontSize: 10,
                      },
                    },
                  }}
                  value={
                    data.temperature
                      ? (data.temperature * 1.8 + 32).toFixed(2)
                      : "- "
                  }
                  minValue={32}
                  maxValue={176}
                />
              </div>
      )
    }
  }

  return (
    <div className="container">
      <div className="left-body">
        <h1 className="header">Meter Dashboard</h1>
        <div className="price">
          <h3>ค่าไฟเดือนนี้</h3>
          <div className="price-status">{price ? (price).toFixed(2): 0} บาท</div>
        </div>
      </div>
      <div className="middle-body">
        <div>
          <div className="status-body">
            <div className="status-block">
              {data.temperature ? data.temperature.toFixed(2) : "- "} °C
            </div>
            <div className="status-block">
              {data.temperature
                ? (data.temperature * 1.8 + 32).toFixed(2)
                : "- "}
              °F
            </div>
            <div className="status-block">{time.toLocaleTimeString()}</div>
          </div>
        </div>
        <div>
          <div className="meter-body">
            <div className="button-body">
              <Button variant="contained" className="button-change" onClick={()=>{setTemperature(prevState => !prevState)}}>เปลี่ยนหน่วย{temperature}</Button>
            </div>
            <div className="sub-meter-body">
              <div className="meter-block">
                <h3>สถานะของอุปกรณ์</h3>
                <div className={isWithinTenMinutes(fetch.datetime) ? 'circle active' : 'circle'} />
                {isWithinTenMinutes(fetch.datetime) ? 'อุปกรณ์ทำงานอยู่' : 'อุปกรณ์ไม่ทำงาน'}
              </div>
              {gaugeTemperature(temperature)}
            </div>
            <div className="sub-meter-body">
              <div className="meter-block">
              <h3>ยูนิตไฟเดือนนี้</h3>
              <div className="unit">
                {price ? (price/8).toFixed(2): 0}
              </div>
              Wh
              </div>
              <div className="meter-block">
              <h3>กำลังไฟที่ใช้งานอยู่</h3>
                <GaugeComponent
                  labels={{
                    valueLabel: {
                      formatTextValue: (value) => value + " W",
                      style: { fill: "#000" },
                    }}}
                  value={data.power}
                  minValue={0}
                  maxValue={200}
                />
              </div>
            </div>
            <div className="graph">
            <h3>กราฟกำลังไฟ</h3>
              <LineChart
                xAxis={[{ data: formattedDatetime, 
                label: "Datetime", 
                scaleType: "time",
                valueFormatter: (formattedDatetime) => moment(formattedDatetime).format('DD-MM-YYYY HH:mm:ss') 
                }]}
                yAxis={[{ label: "Power (W)" }]}
                series={[
                  {
                    data: power,
                    line: { connect: false }
                  },
                ]}
                width={600}
                height={400}
              />
            </div>
            <div className="status-update">
              <h5 className="text-update">ข้อมูลอัปเดตเมื่อ : {data.datetime}</h5>
            </div>
          </div>
        </div>
      </div>
      <di className='right-body'>
        
      </di>
    </div>
  );
}
