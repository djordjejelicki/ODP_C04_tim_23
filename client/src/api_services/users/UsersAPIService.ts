import { apiClient } from "../apiClient";
import type { UserDto, UserRole } from "../../types/users/UserDto";
import type { PublicUser } from "../../types/users/PublicUser";
import type { IUsersAPIService } from "./IUsersAPIService";
import type { ApiResponse } from "../../types/common/ApiResponse";
import axios from "axios";

export const usersApi: IUsersAPIService = {
  async getAll(): Promise<UserDto[]> {
    try {
      const res = await apiClient.get<UserDto[]>("users");
      return res.data;
    } catch(error) {
      console.error("Error loading users: ", error);
      return [];
    }
  },
  async updateRole(id: number, role: UserRole): Promise<ApiResponse> {
    try{
      const res = await apiClient.put<ApiResponse>(`users/${id}/role`, {role,});
      return res.data;
    } catch(error){
        let message = "Failed to update user role.";

        if (axios.isAxiosError(error)) {
            message = error.response?.data?.message || message;
        }

        return {
            success: false,
            message,
            data: null
        };
    }
  },
  async getMe(): Promise<UserDto | null> {
    try{
      const res = await apiClient.get<UserDto>("users/me");
      return res.data;
    } catch(error){
      console.error("Error loading current user: ", error);
      return null;
    }
  },
  async searchPublic(query: string): Promise<PublicUser[]> {
    try{
      const res = await apiClient.get<PublicUser[]>(
        `users/search?q=${encodeURIComponent(query)}`
      );

      return res.data;
    } catch (error){
      console.error("Error searching users: ", error);
      return [];
    }
  },
  async getPublicById(id: number): Promise<PublicUser | null> {
    try{
      const res = await apiClient.get<PublicUser>(`users/${id}`);
      return res.data;
    } catch(error){
      console.error("Error loading public user: ", error);
      return null;
    }
  },
};
