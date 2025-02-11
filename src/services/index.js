import { server } from "../config/environment";
import { ApiService } from "./config";

export const decryptToken = async (token) => {
  const endpoint = `${server}AesEncryption/decrypt`;
  const response = await ApiService.post(endpoint, { data: token });
  return response.json();
};

export const getDataCarrier = async (idCarrier) => {
  const endpoint = `${server}Public/transporte/${idCarrier}`;
  const response = await ApiService.get(endpoint);
  return response.json();
};


export const validateAviableTime = async (idOrigin, date) => {
  const endpoint = `${server}Public/transporteCita/${idOrigin}/${date}`;
  const response = await ApiService.get(endpoint);
  return response.json();
}