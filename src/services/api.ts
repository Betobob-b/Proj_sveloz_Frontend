import axios, { type InternalAxiosRequestConfig, AxiosError} from 'axios';

const api = axios.create({

    baseURL: 'http://localhost:8000/api/',

});

api.interceptors.request.use((config) => {
    
    const token = localStorage.getItem('accessToken');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

}, (error) => {
        return Promise.reject(error);
    }
);

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

api.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');

                const response = await axios.post('http://localhost:8000/api/auth/token/refresh/', {
                    refresh: refreshToken,
                });

                const { access } = response.data;
                localStorage.setItem('accessToken', access);

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${access}`;
                }

                return api(originalRequest);

            }catch (refreshError) {
                console.error('Erro ao atualizar token', refreshError);

                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;