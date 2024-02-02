import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { getApiUrl, loginUrl } from "config/url";
import { Login, authInfo } from "types/authInfo";

export function useLoginUser() {
    return useMutation({
        mutationFn: async (loginData: Login): Promise<authInfo> => {
            const loginPayload = {
                email: loginData.username,
                password: loginData.password
            };

            const response = await axios.post(getApiUrl() + loginUrl, loginPayload);

            return response.data;
        }
    });
}