import axios from "axios";

type EndpointData = {
  host: string;
  port: number;
  ssl?: boolean;
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Crea una instancia de Axios configurada sin autenticación
 * @param endpoint - Configuración del endpoint (opcional)
 * @param addHeaders - Headers adicionales (opcional)
 * @returns Instancia de Axios configurada
 */
const sendRequestBasic = (endpoint?: EndpointData, addHeaders?: any) => {
  let headers: any = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  if (addHeaders) {
    headers = {
      ...headers,
      ...addHeaders,
    };
  }

  const port = Number(import.meta.env.VITE_API_URL_PORT);
  const useEndpoint = endpoint || {
    host: import.meta.env.VITE_API_URL,
    port: port,
    ssl: true,
  };

  const instance = axios.create({
    baseURL: `${useEndpoint.ssl ? "https" : "http"}://${useEndpoint.host}`,
    headers,
    withCredentials: true,
  });

  // Interceptor de respuesta para manejo global de errores
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        // Aquí puedes aplicar lógica de refresco de token si existe, o reintentar la petición.
        // Por ejemplo, reintentar luego de 1 segundo:
        await sleep(1000);
        // Reintentar la solicitud original:
        return instance.request(error.config);
      }
      throw error;
    }
  );

  return instance;
};

export default sendRequestBasic;

