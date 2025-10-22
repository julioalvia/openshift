import type {
  YamlConversionRequest,
  YamlConversionResponse,
} from "core/domain/entities/YamlConverter/YamlConverterEntity";

/**
 * Interfaz del repositorio para conversión de YAML
 */
export interface IYamlConverterRepository {
  /**
   * Convierte un YAML de OpenShift v3 a v4
   * @param request - Solicitud de conversión con el contenido YAML
   * @returns Respuesta con el YAML convertido o error
   */
  convertYaml(request: YamlConversionRequest): Promise<YamlConversionResponse>;
}

