import axios, {AxiosRequestConfig} from "axios";
const localBaseUrl=`http://localhost:7000/api/`
const herokuBaseUrl=`https://wg-force3-backend.herokuapp.com/api/`

export const instance = axios.create({
    baseURL: localBaseUrl,
    withCredentials: false,

} as AxiosRequestConfig)

export enum ResultCodeEnum{
    Success = 0,
    Error = 1,
}

export type genRespType<D={}>={
    resultCode:ResultCodeEnum,
    messages: Array<string>
    data: D
}








