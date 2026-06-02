import type { AuthResponse } from "../../types/auth/AuthResponse";
import type { IAuthAPIService } from "./IAuthAPIService";
import { getValueByKey } from "../../helpers/local_storage";
import axios from "axios";

const API_URL: string = import.meta.env.VITE_API_URL + "auth";

export const authApi: IAuthAPIService = {
  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      const res = await axios.post<AuthResponse>(`${API_URL}/login`, {
        username,
        password,
      });
      return res.data;
    } catch (error) {
      let message = "Login failed.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return {
        success: false,
        message,
        data: undefined,
      };
    }
  },

  async register(
    username: string,
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    avatar: File | null
  ): Promise<AuthResponse> {
    try {
      const formData = new FormData();
      
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("first_name", first_name);
      formData.append("last_name", last_name);

      if (avatar) {
        formData.append("avatar", avatar);
      }

      const res = await axios.post<AuthResponse>(
        `${API_URL}/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
        }
      );

      return res.data;
    } catch (error) {
      let message = "Registration failed.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return {
        success: false,
        message,
        data: undefined,
      };
    }
  },
  async logout(): Promise<boolean> {
    try{
      const token = getValueByKey("authToken");

      await axios.post(
        `${API_URL}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return true;
    } catch(error){
      console.error("Logout audit error: ", error);
      return false;
    }
  },
};
