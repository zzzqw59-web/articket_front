const WeatherCard = ({weather}) => {
    if(!weather) {
        return (
            <div className="weather-card">
                날씨 정보를 불러오는 중입니다.
            </div>
        );
    }

    return (
  <div className="weather-card">
    <div className="weather-main">
      <span className="weather-icon">☀️</span>
      <div className="weather-temp">
        <strong>{weather.temperature}</strong>
        <span className="unit">°C</span>
      </div>
    </div>

    <div className="weather-info">
      <div className="info-item">
        <span className="label">습도</span>
        <strong className="value">{weather.humidity}%</strong>
      </div>
      <div className="info-item">
        <span className="label">강수</span>
        <strong className="value">{weather.precipitationType}</strong>
      </div>
      <div className="info-item">
        <span className="label">풍향</span>
        <strong className="value">{weather.windDirection}</strong>
      </div>
      <div className="info-item">
        <span className="label">풍속</span>
        <strong className="value">{weather.windSpeed} m/s</strong>
      </div>
    </div>
  </div>
);
};
export default WeatherCard;