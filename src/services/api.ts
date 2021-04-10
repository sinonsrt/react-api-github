import axios from 'axios';

const api = axios.create({
    //URL BASE QUE VAI SER REPETIDA TODAS REQUISIÇÕES
    baseURL: 'https://api.github.com'
});

export default api; 