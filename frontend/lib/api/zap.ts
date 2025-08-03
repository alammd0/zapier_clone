import axios from "axios"
import { API_URL } from "@/config";
import { Zap } from "@/types";


export const createZap = async (data : Zap) => {
    console.log("Creating Zap with data:", data);
    const response = await axios.post(`${API_URL}/zap/create-zap`, data , {
        headers : {
            Authorization : `${localStorage.getItem("token")}`
        }
    });

    return response.data;
}

export const getZaps = async () => {
    const response = await axios.get(`${API_URL}/zap/get-zaps`, {
        headers: {
            Authorization: `${localStorage.getItem("token")}`
        }
    });

    return response.data;
}

export const GetAvailableTriggers = async () => {
    const response = await axios.get(`${API_URL}/zap/get-triggers`,
        {
            headers: {
                Authorization: `${localStorage.getItem("token")}`
            }
        }
    );

    return response.data;
}


export const GetAvailableActions = async () => {
    const response = await axios.get(`${API_URL}/zap/get-actions`,
        {
            headers: {
                Authorization: `${localStorage.getItem("token")}`
            }
        }
    );
    return response.data
}