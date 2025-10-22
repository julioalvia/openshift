import type { IYamlConverterRepository } from "core/application/interfaces/YamlConverter/IYamlConverterRepository";
import type { IYamlConverterUseCase } from "core/application/interfaces/YamlConverter/IYamlConverterUseCase";
import {
  YamlConverterEntity,
  type YamlConversionResponse,
} from "core/domain/entities/YamlConverter/YamlConverterEntity";

/**
 * Caso de uso para convertir YAML de OpenShift v3 a v4
 */
export class ConvertYamlUseCase implements IYamlConverterUseCase {
  private readonly repository: IYamlConverterRepository;

  constructor(repository: IYamlConverterRepository) {
    this.repository = repository;
  }

  async execute(yamlContent: string): Promise<YamlConversionResponse> {
    // Validar entrada
    const entity = new YamlConverterEntity(yamlContent);

    if (!entity.isValid()) {
      return {
        success: false,
        error: "El contenido YAML no puede estar vacío",
      };
    }

    try {
      // Ejecutar conversión a través del repositorio
      const response = await this.repository.convertYaml(entity.toRequest());
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";

      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}

