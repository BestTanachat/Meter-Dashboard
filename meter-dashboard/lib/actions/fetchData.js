import axios from "axios";

export const fetchData = async () => {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  try {
    const res = await axios.get(`${baseUrl}/api/data`);

    // // Find the field with a non-empty 'Values' array
    // const chosenField = Object.keys(res.data).find(
    //   (field) => res.data[field].Values.length > 0
    // );

    return res.data[res.data.length - 1];
  } catch (err) {
    throw err;
  }
};

export const fetchUnit = async () => {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  try {
    const res = await axios.get(`${baseUrl}/api/data`);
    const filteredData = res.data.filter(item => item.energy !== 0);

  if (filteredData.length > 0) {
    const maxEnergy = Math.max(...filteredData.map(item => item.energy));
    const minEnergy = Math.min(...filteredData.map(item => item.energy));

    // console.log("Maximum energy:", maxEnergy);
    // console.log("Minimum energy:", minEnergy);
    return [maxEnergy,minEnergy];
  } else {
    console.log("No energy data available after filtering out 0 values.");
    return null
  }
  } catch (err) {
    throw err;
  }
};

export const fetchpower = async () => {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  try {
    const res = await axios.get(`${baseUrl}/api/data`);
    const power = res.data.map(item => item.power);
    const datetime = res.data.map(item => item.datetime);

    return [power, datetime]
  } catch (err) {
    throw err;
  }
};