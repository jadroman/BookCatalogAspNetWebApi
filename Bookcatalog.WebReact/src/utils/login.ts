import { object, string } from "yup";

export const loginValidationSchema = object({
    username: string().required('Username is required.').max(200, `Username maximum length limit is 200`),
    password: string().required('Password is required.').max(200, `Password maximum length limit is 200`),
});