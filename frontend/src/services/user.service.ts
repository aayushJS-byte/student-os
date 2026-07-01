import { api } from "@/api/axios";

export const UserService = {
  updateProfile: async (data: { name: string }) => {
    const res = await api.patch("/user/profile", data);
    return res.data.data.user;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    await api.patch("/user/password", data);
  },
};
