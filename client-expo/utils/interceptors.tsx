import axios from 'axios';

const addTokenInterceptor = (token: string) => {
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

export default addTokenInterceptor;
