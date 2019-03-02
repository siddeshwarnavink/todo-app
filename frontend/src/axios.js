import axios from "axios";

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:9999"
      : "http://server.todo-app.siddeshrocks.in/"
});

export default instance;
