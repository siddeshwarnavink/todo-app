import axios from 'axios';

const instance = axios.create({
     baseURL:
          process.env.NODE_ENV === 'development'
               ? 'http://127.0.0.1:9999/'
               : '/server/',
});

export default instance;
