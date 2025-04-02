
interface AxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: any;
}

const mockGet = async <T>(url: string): Promise<AxiosResponse<T>> => {
  // Return mock data based on URL patterns
  return {
    data: {} as T,
    status: 200,
    statusText: "OK",
    headers: {},
    config: {}
  };
};

const mockPost = async <T>(url: string, data?: any): Promise<AxiosResponse<T>> => {
  return {
    data: {} as T,
    status: 200,
    statusText: "OK",
    headers: {},
    config: {}
  };
};

export default {
  get: mockGet,
  post: mockPost
};
