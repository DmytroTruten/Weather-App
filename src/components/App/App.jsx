import React, { useState, useEffect } from "react";
import "./App.css";
export default function App() {
  const [latitude, setLatitude] = useState([]);
  const [longitude, setLongitude] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      navigator.geolocation.getCurrentPosition(function (position) {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      });

      await fetch(
        `${
          import.meta.env.API_URL
        }/weather?lat=${latitude}&lon=${longitude}&appid=${
          import.meta.env.API_KEY
        }`
      )
        .then((resolve) => resolve.json())
        .then((result) => {
          setData(result);
          console.log(result);
        });
    };
    fetchData();
  }, [latitude, longitude]);

  return <div className="App">
    
  </div>;
}
