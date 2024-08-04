"use client";
import axios from 'axios';
import { getBearerToken } from './bearerauth';
const apiURL = process.env.NEXT_PUBLIC_BASE_URL;
const bt = getBearerToken();




const apiClient = axios.create({
    baseURL: apiURL,
    timeout: 2500,
    headers: { 'authorization': 'Bearer '+ bt },
});
const _post = (url, data = {}, config = {}) => {
  return apiClient.post(url, data, config);
};
const _get = (url, config = {}) => {
  return apiClient.get(url, config);
};
const _delete = (url, config = {}) => {
  return apiClient.delete(url, config);
};
const _put = (url, data = {}, config = {}) => {
  return apiClient.put(url, data, config);
};


 

export { _get, _delete, _put, _post };