import axios from "axios";

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://10.20.239.5:9999/"
      : "/server/"
});

export default instance;
