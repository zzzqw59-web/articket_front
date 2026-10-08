import axios from "axios";

const prefix = "http://localhost:8080/api/statistic";

export const getTotalProfit = async (exhibitionId, startDate, endDate) => {
  const response = await axios.get(`${prefix}/profit/total`, {
    params: {
      exhibitionId,
      startDate,
      endDate,
    },
  });
  return response.data;
};

export const getProfitList = async (exhibitionId, startDate, endDate) => {
  const response = await axios.get(`${prefix}/profit/${exhibitionId}`, {
    params: {
      startDate,
      endDate,
    },
  });
  return response.data;
};

export const getTotalVisitor = async (exhibitionId, startDate, endDate) => {
  const response = await axios.get(`${prefix}/visitor/total`, {
    params: {
      exhibitionId,
      startDate,
      endDate,
    },
  });
  return response.data;
};

export const getVisitorList = async (exhibitionId, startDate, endDate) => {
  const response = await axios.get(`${prefix}/visitor/${exhibitionId}`, {
    params: {
      startDate,
      endDate,
    },
  });
  return response.data;
};

export const getTotalReservation = async (exhibitionId, startDate, endDate) => {
  const response = await axios.get(`${prefix}/reservation/total`, {
    params: {
      exhibitionId,
      startDate,
      endDate,
    },
  });
  return response.data;
};

export const getReservationList = async (exhibitionId, startDate, endDate) => {
  const response = await axios.get(`${prefix}/reservation/${exhibitionId}`, {
    params: {
      startDate,
      endDate,
    },
  });
  return response.data;
};
