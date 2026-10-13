import axiosInstance from "./axiosInstance";

const prefix = "/api/statistic";

export const getTotalProfit = async (startDate, endDate) => {
  const response = await axiosInstance.get(`${prefix}/profit/total`, {
    params: {
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

export const getTotalVisitor = async (startDate, endDate) => {
  const response = await axiosInstance.get(`${prefix}/visitor/total`, {
    params: {
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

export const getTotalReservation = async (startDate, endDate) => {
  const response = await axiosInstance.get(`${prefix}/reservation/total`, {
    params: {
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

export const getTotalCanceledReservation = async (startDate, endDate) => {
  const response = await axiosInstance.get(
    `${prefix}/reservation/canceled/total`,
    {
      params: {
        startDate,
        endDate,
      },
    },
  );
  return response.data;
};

export const getCanceledReservationList = async (
  exhibitionId,
  startDate,
  endDate,
) => {
  const response = await axiosInstance.get(
    `${prefix}/reservation/canceled/${exhibitionId}`,
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
