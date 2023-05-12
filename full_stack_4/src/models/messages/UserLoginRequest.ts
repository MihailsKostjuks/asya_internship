
export interface UserLoginRequest {
    email: string,
    password: string,
    device?: string // IOS or ANDROID
}