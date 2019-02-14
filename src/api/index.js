import axios from 'axios';
const URL_API = 'https://ecubitcoin.com/api';

export const getCountry = () => axios.get(`${URL_API}/country`)
.then(json => json.data.data)

export const getTournament = () => axios.get(`${URL_API}/search`)
.then(json => json.data.data)