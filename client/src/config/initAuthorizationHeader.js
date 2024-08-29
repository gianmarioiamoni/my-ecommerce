import axios from 'axios';

export const initAuthorizationHeader = () => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}