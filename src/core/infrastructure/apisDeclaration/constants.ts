/**
 * Constantes para configuración de APIs
 */

/**
 * Obtiene la URL base para el servicio de conversión
 */
export const getConversionEndpoint = (): string => {
  const envUrl =
    (import.meta.env.VITE_CONVERT_URL as string | undefined) ||
    (import.meta.env.VITE_N8N_WEBHOOK_URL as string | undefined);

  return envUrl && envUrl.length > 0
    ? envUrl
    : "http://localhost:8000/convert";
};

/**
 * URL base de la API principal
 */
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Puerto de la API
 */
export const API_PORT = import.meta.env.VITE_API_URL_PORT || "8000";

