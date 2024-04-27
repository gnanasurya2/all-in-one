import axios from 'axios';

export const addTokenInterceptor = (token: string) => {
  axios.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export const removeRequestInterceptor = () => {
  axios.interceptors.request.clear();
};
