import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getVenueDetail, getVenueWeather } from "../../api/venueApi";
import WeatherCard from "../../components/common/weather/WeatherCard";
import Loading from "../../components/common/Loading";
import "../../styles/ExhibitionAndVenue.css";
import "../../components/common/kakaomap/KakaoMap";
import KakaoMap from "../../components/common/kakaomap/KakaoMap";
import MainLayout from "../../layouts/MainLayout";

const VenueDetailPage = () => {
    const { venueId } = useParams();

    const [venue, setVenue] = useState(null);

    const [weather, setWeather] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            try {
                const [
                    venueData,
                    weatherData,
                ] = await Promise.all([
                    getVenueDetail(venueId),
                    getVenueWeather(venueId),
                ]);

                setVenue(venueData);
                setWeather(weatherData);
            }catch(error) {
                console.error("전시장 상세 조회 실패", error);
            }
        };
        load();
    }, [venueId]);

    if(!venue) {
        return <Loading />;
    }

    return (
        <main className="venue-detail-page">
            <div className="venue-main">

                <img src={venue.photoUrl || "/images/default-venue.jpg"}
                     alt={venue.name} />

                <div className="venue-info">
                    <p>
                        이름 : {" "}
                        {venue.name}
                    </p>
                    <p>
                        전화번호 : {" "}
                        {venue.tel || "-"}
                    </p>
                    <p>
                        &lt;상세 설명&gt;
                    </p>
                    <p>
                        {
                            venue.description || "상세 설명이 없습니다."
                        }
                    </p>
                </div>

                {venue.homePageUrl && (
                    <button onClick = {() => window.open(venue.homePageUrl,"_blank")} >
                        공식 홈페이지
                    </button>
                )}      
            </div>

            <section>
                <h2>
                    전시 목록
                </h2>

                <div className="venue-exhibition-list">
                    {venue.exhibitions?.map(
                        (exhibition) => (
                            <div key={exhibition.id}
                                 onClick={() => navigate(`/articket/exhibition/${exhibition.id}`)}>

                             <img src={exhibition.imgUrl 
                                      ? exhibition.imgUrl.startsWith("http")
                                      ? exhibition.imgUrl : `http://localhost:8080/api/images/${exhibition.imgUrl}` 
                                      : "/images/default-exhibition.jpg"}
                                  alt={exhibition.title} />
                            <p>
                                {
                                    exhibition.title
                                }
                            </p>
                            <p>
                               {
                                exhibition.startDate
                               }
                               {" ~ "}
                               {
                                exhibition.endDate
                               }
                            </p>
                            </div>          
                        )
                    )}
                </div>
            </section>
            <section>
                <h2>
                    전시장 날씨
                </h2>
                <WeatherCard weather={weather} />
            </section>
            <section>
                <h2>
                    위치
                </h2>
                <div id="map" className="venue-map">
                    <KakaoMap 
                    latitude={venue.latitude}
                    longitude={venue.longitude} />
                </div>
            </section>
        </main>
    );
};
export default VenueDetailPage;