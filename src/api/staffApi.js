import axios from "axios";
import axiosInstance from "./axiosInstance";

const prefix = "http://localhost:8080/api";

export const requestStaffAuthority = async (requestDTO) => {
  const response = await axios.post(`${prefix}/staff/requests`, requestDTO);
  return response.data;
};

export const getStaffExhibitions = async () => {
  const response = await axios.get(`${prefix}/staff/exhibitions`);
  return response.data;
};

export const getStaffRequest = async () => {
  const response = await axiosInstance.get(`${prefix}/staff/requests`);
  return response.data;
};

export const getMembers = async (page, size = 5) => {
  const response = await axiosInstance.get(`${prefix}/admin/members`, {
    params: {
      page,
      size,
    },
  });
  return response.data;
};

export const patchDeactivateMember = async (memberId, data) => {
  await axiosInstance.patch(`${prefix}/admin/members/${memberId}/deactivate`, {
    body: data.body,
    term: data.term,
  });
};

export const patchActivateMember = async (memberId) => {
  await axiosInstance.patch(`${prefix}/admin/members/${memberId}/activate`);
};

export const getStaffRequestsAll = async () => {
  const response = await axiosInstance.get(
    `${prefix}/admin/staff/requests`,
  );
  return response.data;
};

export const patchApproveStaffRequest = async (requestId) => {
  await axiosInstance.patch(
    `${prefix}/admin/staff/requests/${requestId}/approve`,
  );
};

export const patchRejectStaffRequest = async (requestId) => {
  await axiosInstance.patch(
    `${prefix}/admin/staff/requests/${requestId}/reject`,
  );
};

export const patchCreateStaff = async (data) => {
  const response = await axiosInstance.post(`${prefix}/admin/staff`, {
    email: data.email,
    password: data.password,
    nickname: data.nickname,
    name: data.name,
    phone: data.phone,
  });

  return response.data;
};