import { apiClient } from "../apiClient";
import type { UserDto, UserRole } from "../../types/users/UserDto";
import type { IUsersAPIService } from "./IUsersAPIService";


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
  async updateRole(id: number, role: UserRole): Promise<boolean> {
    try{
      await apiClient.put(`users/${id}/role`, {role,});
      return true;
    } catch(error){
      console.error("Error updating user role: ", error);
      return false;
    }
  },
};
