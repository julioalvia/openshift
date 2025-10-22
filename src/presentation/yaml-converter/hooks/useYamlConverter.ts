import { useState, useCallback, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { YamlConverterService } from "core/application/services/YamlConverter/YamlConverterService";
import { YAML_CONVERTER_CONSTANTS } from "core/domain/entities/YamlConverter/YamlConverterEntity";
import { getConversionEndpoint } from "core/infrastructure/apisDeclaration/constants";

/**
 * Hook personalizado para gestionar la conversión de YAML
 * Utiliza TanStack Query para el manejo del estado de la mutación
 */
export const useYamlConverter = () => {
  const [yamlText, setYamlText] = useState<string>(YAML_CONVERTER_CONSTANTS.SAMPLE_YAML);

  const endpoint = getConversionEndpoint();
  
  // Instancia del servicio memoizada para evitar recreaciones
  const yamlConverterService = useMemo(() => new YamlConverterService(), []);

  /**
   * Mutación para convertir YAML usando TanStack Query
   */
  const {
    mutate: convertYaml,
    mutateAsync: convertYamlAsync,
    data: conversionData,
    isPending,
    isError,
    error: mutationError,
    reset,
  } = useMutation({
    mutationKey: ["convertYaml"],
    mutationFn: async (yamlContent: string) => {
      return await yamlConverterService.convertYaml(yamlContent);
    },
    onSuccess: (data) => {
      if (!data.success) {
        // Si la conversión no fue exitosa, lanzar error para que onError lo maneje
        throw new Error(data.error || "Error desconocido en la conversión");
      }
    },
  });

  // Derivar estado del resultado
  const resultYaml = conversionData?.success ? conversionData.yamlOutput : null;
  
  // Determinar el mensaje de error de forma más clara
  const getErrorMessage = (): string | null => {
    if (isError) {
      return mutationError instanceof Error
        ? mutationError.message
        : "Error desconocido";
    }
    
    if (conversionData && !conversionData.success) {
      return conversionData.error || "Error en la conversión";
    }
    
    return null;
  };
  
  const error = getErrorMessage();

  /**
   * Convierte el YAML de OpenShift v3 a v4
   */
  const handleConvert = useCallback(() => {
    if (yamlText.trim().length === 0) {
      return;
    }
    convertYaml(yamlText);
  }, [yamlText, convertYaml]);

  /**
   * Limpia todos los campos
   */
  const handleClear = useCallback(() => {
    setYamlText("");
    reset(); // Resetear el estado de la mutación
  }, [reset]);

  /**
   * Carga el ejemplo predeterminado
   */
  const handleLoadSample = useCallback(() => {
    setYamlText(YAML_CONVERTER_CONSTANTS.SAMPLE_YAML);
    reset(); // Resetear el estado de la mutación
  }, [reset]);

  /**
   * Copia el resultado al portapapeles
   */
  const handleCopyOutput = useCallback(() => {
    if (!resultYaml) return;
    navigator.clipboard.writeText(resultYaml).catch(() => {
      // El error será manejado silenciosamente o se podría mostrar un toast
      console.error("Error al copiar al portapapeles");
    });
  }, [resultYaml]);

  /**
   * Obtiene el estado del badge basado en el estado actual
   */
  const getBadgeStatus = useCallback(() => {
    if (isPending) {
      return {
        text: "Convirtiendo…",
        className: "bg-blue-100 text-blue-800 border-transparent",
      };
    }

    if (resultYaml) {
      return {
        text: "Conversión lista",
        className: "bg-green-100 text-green-800 border-transparent",
      };
    }

    if (error) {
      return {
        text: "Error en conversión",
        className: "bg-red-100 text-red-800 border-transparent",
      };
    }

    return {
      text: "Sin datos",
      className: "bg-gray-100 text-gray-800 border-transparent",
    };
  }, [isPending, resultYaml, error]);

  return {
    // Estado
    yamlText,
    resultYaml,
    loading: isPending,
    error,
    endpoint,

    // Estado de TanStack Query
    isLoading: isPending,
    isError,
    isSuccess: !!resultYaml,

    // Acciones
    setYamlText,
    handleConvert,
    handleClear,
    handleLoadSample,
    handleCopyOutput,
    getBadgeStatus,
    
    // Utilidades
    reset, // Para resetear manualmente el estado
    convertYamlAsync, // Para conversiones asíncronas avanzadas
  };
};

