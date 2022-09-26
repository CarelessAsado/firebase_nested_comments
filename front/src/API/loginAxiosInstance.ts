import { BACKEND_ROOT } from "config/constants";
import axios from "axios";

export default axios.create({
  baseURL: BACKEND_ROOT,
  withCredentials: true,
});
