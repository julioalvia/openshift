import type { IYamlConverterRepository } from "core/application/interfaces/YamlConverter/IYamlConverterRepository";
import type { YamlConversionResponse } from "core/domain/entities/YamlConverter/YamlConverterEntity";
import { ConvertYamlUseCase } from "core/domain/useCases/YamlConverter/ConvertYamlUseCase";
import { YamlConverterRepositoryImpl } from "core/infrastructure/repositories/YamlConverter/YamlConverterRepository";

/**
 * Servicio de aplicación para conversión de YAML
 * Coordina los casos de uso y repositorios
 */
export class YamlConverterService {
  private readonly convertYamlUseCase: ConvertYamlUseCase;

  constructor() {
    const repository: IYamlConverterRepository =
      new YamlConverterRepositoryImpl();
    this.convertYamlUseCase = new ConvertYamlUseCase(repository);
  }

  /**
   * Convierte YAML de OpenShift v3 a v4
   * @param yamlContent - Contenido YAML a convertir
   * @returns Resultado de la conversión
   */
  async convertYaml(yamlContent: string): Promise<YamlConversionResponse> {
    return await this.convertYamlUseCase.execute(yamlContent);
  }
}

