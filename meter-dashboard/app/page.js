"use client";
import React, { useState, useEffect } from "react";
import "./page.css";
import { fetchData } from "@/lib/actions/fetchData";
import dynamic from "next/dynamic";
const GaugeComponent = dynamic(() => import("react-gauge-component"), {
  ssr: false,
});
import { LineChart } from '@mui/x-charts/LineChart';

export default function Home() {
  const [time, setTime] = useState(new Date());
  const [data, setData] = useState({
    temperature: "",
    energy: "",
    isloading: true,
    error: null,
  });

  const getData = async () => {
    try {
      const fetch = await fetchData();
      setData({ ...fetch, isloading: false, error: null });
      console.log(fetch);
    } catch (err) {
      setData((prevState) => ({
        ...prevState,
        isloading: false,
        error: err.message || "Error fetching data",
      }));
    }
  };

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

  return (
    <div className="container">
      <div className="left-body">
        <h1 className="header">Meter Dashboard</h1>
        <div className="price">
          <h3>ค่าไฟเดือนนี้</h3>
          <div className="price-status">{data.energy} บาท</div>
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
            <div className="sub-meter-body">
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
            </div>
            <div className="sub-meter-body">
              <div className="meter-block">3</div>
              <div className="meter-block">
              <h3>กำลังไฟที่ใช้งานอยู่</h3>
                <GaugeComponent
                  labels={{
                    valueLabel: {
                      formatTextValue: (value) => value + " W",
                      style: { fill: "#000" },
                    }}}
                  value={data.energy}
                  minValue={0}
                  maxValue={200}
                />
              </div>
            </div>
            <div className="graph">
            <h3>กราฟกำลังไฟ</h3>
              <LineChart
                xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                series={[
                  {
                    data: [2, 5.5, 2, 8.5, 1.5, 5],
                  },
                ]}
                width={650}
                height={400}
              />
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
