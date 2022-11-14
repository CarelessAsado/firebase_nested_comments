import axios, { HeadersDefaults } from "axios";
import { BACKEND_ROOT, BACKEND_URL } from "config/constants";

export const headerKey = "auth-token";
const axiosInstanceJWT = axios.create({
  baseURL: BACKEND_ROOT + BACKEND_URL.ROOT_API_VERSION,
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

export function getHeadersChatAuth() {
  return (axiosInstanceJWT.defaults.headers as CommonHeaderProperties)[
    headerKey
  ];
}
export default axiosInstanceJWT;
