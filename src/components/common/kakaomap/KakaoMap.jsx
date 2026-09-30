import { useEffect, useRef } from "react";

const KakaoMap = ({ latitude, longitude, name }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!latitude || !longitude) return;

    // autoload=false로 뒀으니, 지도 그릴 때 직접 load 호출
    window.kakao.maps.load(() => {
      const container = mapRef.current;
      const options = {
        center: new window.kakao.maps.LatLng(latitude, longitude),
        level: 3,
      };

      const map = new window.kakao.maps.Map(container, options);

      const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
      const marker = new window.kakao.maps.Marker({ position: markerPosition });
      marker.setMap(map);

      if (name) {
        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px;font-size:12px;">${name}</div>`,
        });
        infowindow.open(map, marker);
      }
    });
  }, [latitude, longitude, name]);

  if (!latitude || !longitude) {
    return <div className="map-placeholder">위치 정보가 없습니다.</div>;
  }

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
};

export default KakaoMap;