import axios from "axios";
import axiosInstance from "./axiosInstance";

//서버 주소 
const API_SERVER_HOST =  "http://localhost:8080";
const PREFIX = `${API_SERVER_HOST}/api/exhibitions`;


//전시 목록 조회
export const getExhibitionList = async ({
    keyword = "",
    sort = "latest",
    free = true,
    page = 0,
    size = 9,
} = {}) => {
    const response = await axios.get(PREFIX, {
        params: {
            keyword,
            sort,
            free,
            page,
            size,
        },
        withCredentials: true,
    });
    return response.data;
};

// 전시 상세 조회
export const getExhibitionDetail = async(exhibitionId) => {
    const response = await axios.get(
        `${PREFIX}/${exhibitionId}`,
        {
            withCredentials: true,
        }
    );
    return response.data;
};

//전시 수정
export const updateExhibition = async(
    exhibitionId,
    data,
    image = null
) => {
    const formData = new FormData();

    formData.append(
        "data",
        new Blob(
            [JSON.stringify(data)],
            {type: "application/json"}
        )
    );

    if(image) {
        formData.append("image", image);
    }

    const response = await axiosInstance.put(
        `${PREFIX}/${exhibitionId}`,
        formData,
        {
            withCredentials: true,
        }
    );
    return response.data;
};

//전시 삭제
export const deleteExhibition = async(exhibitionId) => {
    const response = await axiosInstance.delete(
        `${PREFIX}/${exhibitionId}`,
        {
            withCredentials: true,
        }
    );
    return response.data;
};