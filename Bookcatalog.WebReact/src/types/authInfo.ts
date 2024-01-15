
export type authInfo = {
    userInfo: UserInfo
    token?: string,
    refreshToken?: string,
}

export type UserInfo = {
    userName?: string,
    firstName?: string,
    lastName?: string,
    phoneNum?: string
}
