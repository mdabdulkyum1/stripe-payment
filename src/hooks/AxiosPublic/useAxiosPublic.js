import axios from 'axios';

export default function useAxiosPublic() {

  const instance = axios.create({
    baseURL: 'http://localhost:5000/api/v1', 
  });
  return instance;
} 