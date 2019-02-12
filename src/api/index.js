import axios from 'axios';
const URL_API = 'http://159.65.67.135:3001/api';

export const getCountry = () => axios.get(`${URL_API}/search`)
.then(json => json.data.data)

export const getTournament = () => axios.get(`${URL_API}/search`)
.then(json => json.data.data)