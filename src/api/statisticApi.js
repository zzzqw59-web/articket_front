import axiosInstance from "./axiosInstance";

const prefix = "/api/statistic";

export const getTotalProfit = async (exhibitionId, startDate, endDate) => {
  const response = await axiosInstance.get(`${prefix}/profit/total`, {
    params: {
      exhibitionId,
      startDate,
      endDate,
    },
  });
  return response.data;
};

export const getProfitList = async (exhibitionId, startDate, endDate) => {
  const response = await axiosInstance.get(`${prefix}/profit/${exhibitionId}`, {
    params: {
      startDate,
      endDate,
    },
  });
  return response.data;
};

export const getTotalVisitor = async (exhibitionId, startDate, endDate) => {
  const response = await axiosInstance.get(`${prefix}/visitor/total`, {
    params: {
      exhibitionId,
      startDate,
      endDate,
    },
  });
  return response.data;
};

export const getVisitorList = async (exhibitionId, startDate, endDate) => {
  const response = await axiosInstance.get(
    `${prefix}/visitor/${exhibitionId}`,
    {
      params: {
        startDate,
        endDate,
      },
    },
  );
  return response.data;
};

export const getTotalReservation = async (exhibitionId, startDate, endDate) => {
  const response = await axiosInstance.get(`${prefix}/reservation/total`, {
    params: {
      exhibitionId,
      startDate,
      endDate,
    },
  });
  return response.data;
};

export const getReservationList = async (exhibitionId, startDate, endDate) => {
  const response = await axiosInstance.get(
    `${prefix}/reservation/${exhibitionId}`,
    {
      params: {
        startDate,
        endDate,
      },
    },
  );
  return response.data;
};

export const getTotalCancel = async () => {
  const response = await axiosInstance.get(`${prefix}/cancel/total`);
  return response.data;
};

export const getCancelList = async (exhibitionId) => {
  const response = await axiosInstance.get(`${prefix}/cancel/${exhibitionId}`);
  return response.data;
};

export const getCancelDetail = async (exhibitionId) => {
  const response = await axiosInstance.get(
    `${prefix}/cancel/detail/${exhibitionId}`,
  );
  return response.data;
};
