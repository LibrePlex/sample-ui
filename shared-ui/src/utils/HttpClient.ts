
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import Debug from "debug";


export interface HttpResponse<T = any> {
    data: T | undefined,
    error: any,
    status: number
  }


declare module "axios" {
  interface AxiosResponse<T = any> extends Promise<T> {}
}

export class HttpClient {
  protected readonly instance: AxiosInstance;
  private readonly baseUrl: string;

  public constructor(baseURL: string, config?: Partial<AxiosRequestConfig> ) {
    this.instance = axios.create({
      baseURL,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      ...config, // will override heads if present
    });
   
    this.baseUrl = baseURL;
    

    this._initializeResponseInterceptor();
  }

  private _initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(
      (response) => ({
        ...response,
        data: response.data,
        error: undefined,
        status: response.status,
      }),
      async (error) => {
        return {
          data: undefined,
          
          error: {
            message: error?.response?.data?.error?.message,
            code: error?.response?.data?.error?.code,
          },
          status: error.code,
        };
      }
    );
  };
  public get<T>(
    url: string,
    options?: AxiosRequestConfig
  ): Promise<HttpResponse<T>> {
    
    return this.instance.get<T>(url, options) as any;
  }

  public post<T>(
    url: string,
    data: any,
    options?: any
  ): Promise<HttpResponse<T>> {
    return this.instance.post<T>(url, data, options) as any;
  }

  public delete<T>(url: string, options?: any): Promise<HttpResponse<T>> {
    return this.instance.delete<T>(url, options) as any;
  }

  public put<T>(
    url: string,
    data: any,
    options?: any
  ): Promise<HttpResponse<T>> {
    return this.instance.put<T>(url, data, options) as any;
  }

  public patch<T>(
    url: string,
    data: any,
    options?: any
  ): Promise<HttpResponse<T>> {
    return this.instance.patch<T>(url, data, options) as any;
  }
}
