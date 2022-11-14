import { BACKEND_ROOT, BACKEND_URL } from "config/constants";
import axios from "axios";

export default axios.create({
  baseURL: BACKEND_ROOT + BACKEND_URL.ROOT_API_VERSION,
  withCredentials: true,
});
