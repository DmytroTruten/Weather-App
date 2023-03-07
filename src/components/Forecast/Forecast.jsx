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
  }, [props.city]);

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
        <div className="forecast-3-hour d-flex flex-column align-items-center" key={i}>
          <p>{`${forecastData.list[i].dt_txt.slice(-8, -3)}`}</p>
          <img className="forecast-icon"
            src={`https://openweathermap.org/img/wn/${forecastData.list[i].weather[0].icon}@2x.png`}
            alt=""
          />
          <p>{Math.round(forecastData.list[i].main.temp)}&#176;</p>
        </div>
      );
    }
    return forecastArray;
  };

  return (
    <div className="forecast-container w-100 d-flex justify-content-between">
      {forecastData.list && forecastData.list.length ? appendForecast() : null}
    </div>
  );
}
