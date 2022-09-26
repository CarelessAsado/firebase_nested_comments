import axios, { HeadersDefaults } from "axios";
import { BACKEND_ROOT } from "config/constants";

export const headerKey = "auth-token";
const axiosInstanceJWT = axios.create({
  baseURL: BACKEND_ROOT,
  headers: {
    [headerKey]: "",
  },
  withCredentials: true,
});
interface CommonHeaderProperties extends HeadersDefaults {
  [headerKey]: string;
}
export function setHeaders(accessToken: string = "") {
  axiosInstanceJWT.defaults.headers = {
    [headerKey]: accessToken,
  } as CommonHeaderProperties;
  console.log(axiosInstanceJWT.defaults.headers, 666);
}

export default axiosInstanceJWT;
