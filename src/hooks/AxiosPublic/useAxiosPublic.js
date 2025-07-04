import axios from 'axios';

export default function useAxiosPublic() {
  // You can customize the baseURL if needed
  const instance = axios.create({
    baseURL: '/', // or your API base URL
  });
  return instance;
} 