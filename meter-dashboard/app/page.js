"use client"
import React, { useState, useEffect } from 'react';
import "./page.css";
import { fetchData } from "@/lib/actions/fetchData";


export default function Home() {
  const [time, setTime] = useState(new Date());
  const [data, setData] = useState({
    temperature: '',
    isloading: true,
    error: null,
  });

  // const getData = async () => {
  //   const fetch = await fetchData()
  //   setData(fetch)
  //   console.log(data)
  // }

  const getData = async () => {
    try {
      const fetch = await fetchData()
      setData({ ...fetch, isloading: false, error: null });
      console.log(fetch)
    } catch (err) {
      setData(prevState => ({
        ...prevState,
        isloading: false,
        error: err.message || 'Error fetching data'
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
    return <div className='load-status'>Loading...</div>;
  }

  return (
    <div className="container">
      <h1 className='header'>Meter Dashboard</h1>
      <div className="body">
        <div className="status-body">
          <div className="status-block">
          {data.temperature.toFixed(2)} °C
          </div>
          <div className="status-block">
          {((data.temperature * 1.8) + 32).toFixed(2)} °F
          </div>
          <div className="status-block">
            {time.toLocaleTimeString()}
          </div>
        </div>
      </div>
      <div className="body">
        <div className="meter-body">
        
        </div>
      </div>
    </div>
  );
}


