import type { IYamlConverterRepository } from "core/application/interfaces/YamlConverter/IYamlConverterRepository";
import type {
  YamlConversionRequest,
  YamlConversionResponse,
} from "core/domain/entities/YamlConverter/YamlConverterEntity";
import { getConversionEndpoint } from "core/infrastructure/apisDeclaration/constants";
import sendRequestBasic from "core/infrastructure/apisDeclaration/axiosRequest";
import type { AxiosError } from "axios";

/**
 * Implementación del repositorio para conversión de YAML
 * Utiliza Axios para comunicarse con el servicio de conversión
 */
export class YamlConverterRepositoryImpl implements IYamlConverterRepository {
  private readonly endpoint: string;
  private readonly axiosInstance;

  constructor() {
    this.endpoint = getConversionEndpoint();
    this.axiosInstance = sendRequestBasic();
  }

  async convertYaml(
    request: YamlConversionRequest
  ): Promise<YamlConversionResponse> {
    try {
      const response = await this.axiosInstance.post(this.endpoint, {
        yaml_content: request.yamlContent,
      });

      const data = response.data;
      const contentType = response.headers["content-type"] || "";

      if (contentType.includes("application/json")) {
        const yamlOutput =
          typeof data?.yaml_output === "string"
            ? data.yaml_output
            : JSON.stringify(data, null, 2);

        return {
          success: true,
          yamlOutput,
          message: "Conversión exitosa",
        };
      }

      // Si la respuesta no es JSON, usar los datos como string
      return {
        success: true,
        yamlOutput: typeof data === "string" ? data : JSON.stringify(data, null, 2),
        message: "Conversión exitosa",
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      
      let errorMessage = "Error desconocido";
      
      if (axiosError.response?.data) {
        // Intentar extraer el mensaje de error de diferentes formatos
        const errorData = axiosError.response.data;
        if (typeof errorData === "string") {
          errorMessage = errorData;
        } else if (typeof errorData === "object" && errorData !== null) {
          errorMessage = JSON.stringify(errorData);
        }
      } else if (axiosError.message) {
        errorMessage = axiosError.message;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}

