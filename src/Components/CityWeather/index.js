import React from "react";
import { get } from "lodash";
import "./styles.css";

function CityWeather({ data, name = "" }) {
  const minTemp = get(data, "DailyForecasts[0].Temperature.Minimum.Value", 0);
  const maxTemp = get(data, "DailyForecasts[0].Temperature.Maximum.Value", 0);

  const extremeTemp = Math.abs(minTemp) > Math.abs(maxTemp) ? minTemp : maxTemp;
  const isBelowZero = extremeTemp < 0;
  const intensity = ((Math.abs(extremeTemp) * 100) / 40 / 100).toFixed(2);

  const backdropStyle = {
    opacity: intensity
  };

  return (
    <div className="city-weather">
      <div
        className={`weather-backdrop gamma-${isBelowZero ? "cold" : "hot"}`}
        style={backdropStyle}
      />
      <div
        className={`weather-backdrop flipped gamma-${
          isBelowZero ? "cold" : "hot"
        }`}
        style={backdropStyle}
      />
      {data && (
        <section className="weather-content">
          <div className="city-name">{name}</div>
          <div className="city-temperature">{extremeTemp}°</div>
          <div className="city-forecast">{data.Headline.Text}</div>
        </section>
      )}
    </div>
  );
}

export default CityWeather;
