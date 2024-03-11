import axios from "axios";

export const fetchData = async () => {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  try {
    const res = await axios.get(`${baseUrl}/api/data`);
    console.log(res.data[res.data.length - 1])

    // // Find the field with a non-empty 'Values' array
    // const chosenField = Object.keys(res.data).find(
    //   (field) => res.data[field].Values.length > 0
    // );

    return res.data[res.data.length - 1];
  } catch (err) {
    throw err;
  }
};
