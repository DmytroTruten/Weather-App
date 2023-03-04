import React, { useState, useEffect } from "react";
import "./App.css";
export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchWeatherData();
      setData(response);
      console.log(response);
    };
    fetchData();
  }, []);

  const fetchWeatherData = async () => {
    const response = await fetch(
      `${
        import.meta.env.API_URL
      }/weather?q=Kyiv&appid=${
        import.meta.env.API_KEY
      }&units=metric`
    );
    const result = await response.json();
    return result;
  };

  return (
    <div className="App">
      <p></p>
    </div>
  );
}
