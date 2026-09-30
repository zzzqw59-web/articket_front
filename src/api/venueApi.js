import axios from "axios";

const API_SERVER_HOST = "http://localhost:8080";
const PREFIX = `${API_SERVER_HOST}/api/venues`;

//전시장 목록 조회
export const getVenueList = async({
    keyword = "",
    sort = "latest",
    page = 0,
    size = 20,
} = {}) => {
    const response = await axios.get(PREFIX, {
        params: {
            keyword,
            sort,
            page,
            size,
        },
        withCredentials: true,
    });
    return response.data;
};

//전시장 상세 조회
 export const getVenueDetail = async(venueId) => {
    const response = await axios.get(
        `${PREFIX}/${venueId}`,
        {
            withCredentials: true,
        }
    );
    return response.data;
};

//전시장 날씨 조회
export const getVenueWeather = async(venueId) => {
    const response = await axios.get(
        `${PREFIX}/${venueId}/weather`,
        {
            withCredentials: true,
        }
    );
    return response.data;
};