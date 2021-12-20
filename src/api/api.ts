import axios, { AxiosRequestConfig } from 'axios';

const baseURL = `https://wg-force3-backend.herokuapp.com/api/`;
// const LocalBaseURL = `http://localhost:7000/api/`;

const instance = axios.create({
  baseURL,
  withCredentials: false,
} as AxiosRequestConfig);

export default instance;
