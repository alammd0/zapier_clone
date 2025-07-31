import { API_URL } from "@/config";
import { LoginData, SignUpData } from "@/types";
import axios from "axios";

export const SignUp = async (data : SignUpData) => {
    const response = await axios.post(`${API_URL}/user/signup`, data)
    return response.data
}

export const Login = async (data : LoginData) => {
    const response = await axios.post(`${API_URL}/user/login`, data);
    return response.data
}

export const GetUser = async () => {
    const response = await axios.get(`${API_URL}/user/getuser`,  {
        headers : {
            Authorization : `${localStorage.getItem("token")}`
        }
    });
    return response.data
}