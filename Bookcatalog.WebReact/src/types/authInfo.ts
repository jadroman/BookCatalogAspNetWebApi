
export type authInfo = {
    userInfo?: UserInfo,
    token?: string,
    refreshToken?: string,
    isError?: boolean
};

export type UserInfo = {
    userName?: string,
    firstName?: string,
    lastName?: string,
    phoneNum?: string
};

export type Login = {
    username: string,
    password: string
};
