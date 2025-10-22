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
 * Crea una instancia de Axios configurada con soporte para autenticación
 * @param endpoint - Configuración del endpoint (opcional)
 * @param addHeaders - Headers adicionales (opcional)
 * @returns Instancia de Axios configurada
 */
const sendRequest = (endpoint?: EndpointData, addHeaders?: any) => {
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
    port,
    ssl: true,
  };

  const instance = axios.create({
    baseURL: `${useEndpoint.ssl ? "https" : "http"}://${useEndpoint.host}`,
    headers,
    withCredentials: true,
  });

  // Interceptor de petición: añade el token automáticamente
  instance.interceptors.request.use(
    (config) => {
      // Aquí se puede implementar la lógica para agregar token de autenticación
      return config;
    },
    (error) => {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  );

  // Interceptor de respuesta para manejo global de errores
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const serverError = error.response?.data;

      if (serverError?.errorCode === 1007) {
        // Forzar logout global
        // globalLogout();
        // Retornar el error para que la promesa se rechace
        throw new Error(error instanceof Error ? error.message : String(error));
      }

      if (error.response && error.response.status === 401) {
        await sleep(1000);
        // Reintentar la solicitud original:
        return instance.request(error.config);
      }

      if (error.response && [422].includes(error.response.status)) {
        throw serverError;
      }

      throw new Error(error instanceof Error ? error.message : String(error));
    }
  );

  return instance;
};

export default sendRequest;

