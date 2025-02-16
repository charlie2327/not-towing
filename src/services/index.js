import { server } from "../config/environment";
import { ApiService } from "./config";

export const decryptToken = async (token) => {
  const endpoint = `${server}AesEncryption/decrypt`;
  const response = await ApiService.post(endpoint, { data: token });
  return response.json();
};

export const getDataCarrier = async (idCarrier, token) => {
  const endpoint = `${server}Public/transporteCita/transporte/${idCarrier}`;
  const response = await ApiService.post(endpoint, {token: token});
  return response.json();
};

export const getDataVehicle = async (lote, token) => {
  const endpoint = `${server}Public/transporteCita/vehiculo/${lote}`;
  const response = await ApiService.post(endpoint, {token: token});
  return response.json();
};

export const validateAvailableTime = async (idOrigin, date) => {
  const endpoint = `${server}Public/transporteCita/${idOrigin}/${date}`;
  const response = await ApiService.get(endpoint);
  return response.json();
}

export const saveAppointment = async (data) => {
  const endpoint = `${server}Public/transporteCita`;
  const response = await ApiService.post(endpoint, data);
  return response.json();
};
