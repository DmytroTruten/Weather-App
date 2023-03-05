import React, { useState, useEffect } from "react";

export default function ForecastSection(props) {
  const [forecastData, setForecastData] = useState([]);

  const fetchData = async () => {
    const forecastResponse = await fetchForecastData();
    setForecastData(forecastResponse);
    console.log(forecastResponse);
  };

  useEffect(() => {
    try {
      fetchData();
    } catch {
      setForecastData([]);
    }
  }, []);

  const fetchForecastData = async () => {
    const forecastResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/forecast?q=${props.city}&appid=${
        import.meta.env.VITE_API_KEY
      }&units=metric`
    );
    if (!forecastResponse.ok) {
      throw new Error("Something went wrong...");
    }
    const forecastResult = await forecastResponse.json();
    return forecastResult;
  };

  const appendForecast = () => {
    const forecastArray = [];
    for (let i = 0; i < 5; i++) {
      forecastArray.push(
        <div key={i}>
          <p>{forecastData.list[i].main.temp}&#176;</p>
        </div>
      );
    }
    return forecastArray;
  };

  return (
    <div className="forecast-container d-flex">
      {forecastData.list && forecastData.list.length ? appendForecast() : null}
    </div>
  );
}


