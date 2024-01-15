import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getApiUrl, loginUrl } from "config/url";
import { authInfo } from "types/authInfo";


/* export function useLoginUser() {
    return useQuery<User>({
        queryKey: [
            'categoryData'
        ],
        queryFn: async (): Promise<User> => {

            const loginPayload = {
                email: 'octopus@yahoo.com',
                password: '2xSNzSa$'
            }

            const response = await axios.post(getApiUrl() + loginUrl, loginPayload);

            return response.data;
        }
    });
}
 */

export function useLoginUser() {
    return useMutation({
        mutationFn: async (): Promise<authInfo> => {
            const loginPayload = {
                email: 'octopus@yahoo.com',
                password: '2xSNzSa$'
            }

            const response = await axios.post(getApiUrl() + loginUrl, loginPayload);

            return response.data;
        }
    });
}