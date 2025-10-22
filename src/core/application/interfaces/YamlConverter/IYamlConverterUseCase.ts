import type { YamlConversionResponse } from "core/domain/entities/YamlConverter/YamlConverterEntity";

/**
 * Interfaz del caso de uso para conversión de YAML
 */
export interface IYamlConverterUseCase {
  /**
   * Ejecuta la conversión de YAML
   * @param yamlContent - Contenido YAML a convertir
   * @returns Respuesta con el resultado de la conversión
   */
  execute(yamlContent: string): Promise<YamlConversionResponse>;
}

