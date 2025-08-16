import { API_URL } from "@/config";
import { LoginData, SignUpData } from "@/types";
import axios from "axios";

export const SignUp = async (data : SignUpData) => {
    const response = await axios.post(`${API_URL}/user/signup`, data)
    return response.data
}

export const VerifyOTPBackend = async (data : any) => {
    const response = await axios.post(`${API_URL}/user/verify-otp`, data);
    console.log("response - verify otp", response);
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

export const SendEmailBackend = async (email : string) => {
    const response = await axios.post(`${API_URL}/user/send-email`, {
        email
    });
    return response.data;
} ;

export const ChangePassword = async (data : any, token : string) => {
    const response = await axios.put(`${API_URL}/user/update-password?token=${token}`, data);
    return response.data;
}

