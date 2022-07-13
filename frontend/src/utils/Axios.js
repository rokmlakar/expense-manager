import axios from 'axios';
import { AXIOS_URL } from '../constants/config';

const Ax = axios.create({
    baseURL: AXIOS_URL, //'http://localhost:5000/api/'
    withCredentials: true //indicates whether or not cross-site Access-Control requests should be made using credentials such as cookies, authorization headers or TLS client certificates
})

export default Ax;  