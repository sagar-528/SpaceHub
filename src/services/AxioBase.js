import axios from "axios";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";


const AxiosBase = axios.create({
  baseURL: API_URL,
});

const getToken = async () => {
  const token = await AsyncStorage.getItem("token");
  return "Bearer " + token;
};

AxiosBase.interceptors.request.use(
 async (config) => {
    config.headers["Authorization"] = await getToken();
    config.headers["Content-Type"] = "application/x-www-form-urlencoded";
    // console.log("Axios base data", config);
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default AxiosBase;
