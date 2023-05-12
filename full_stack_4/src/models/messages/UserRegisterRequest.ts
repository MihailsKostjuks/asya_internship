
export interface UserRegisterRequest {
    email: string,
    password: string,
    reEnterPassword: string,
    device?: string // IOS or ANDROID
}