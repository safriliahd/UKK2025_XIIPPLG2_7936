import axios from "axios";

const API_URL = axios.create({
  baseURL: "http://localhost:5000", 
})


export default API_URL;
