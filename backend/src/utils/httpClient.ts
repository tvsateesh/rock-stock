import axios from 'axios';
import { config } from '../config';

const instance = axios.create({
  baseURL: `https://${config.rapidapiHost}`,
  timeout: 10000,
  headers: {
    'x-rapidapi-key': config.rapidapiKey,
    'x-rapidapi-host': config.rapidapiHost,
    'Content-Type': 'application/json'
  }
});

export default instance;
