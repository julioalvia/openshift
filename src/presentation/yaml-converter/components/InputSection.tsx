import { Label } from "shared/components/ui/label";
import { Textarea } from "shared/components/ui/textarea";
import { Button } from "shared/components/animate-ui/components/buttons/button";
import { Loader2 } from "lucide-react";

interface InputSectionProps {
  yamlText: string;
  loading: boolean;
  error: string | null;
  onYamlTextChange: (value: string) => void;
  onConvert: () => void;
  onClear: () => void;
  onLoadSample: () => void;
}

/**
 * Componente para la sección de entrada de YAML
 */
export const InputSection = ({
  yamlText,
  loading,
  error,
  onYamlTextChange,
  onConvert,
  onClear,
  onLoadSample,
}: InputSectionProps) => {
  const isDisabled = loading || yamlText.trim().length === 0;

  return (
    <div className="space-y-2">
      <Label htmlFor="yaml">DeploymentConfig (YAML)</Label>
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={onConvert}
          disabled={isDisabled}
          aria-busy={loading}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              Convirtiendo…
            </>
          ) : (
            "Convertir a v4"
          )}
        </Button>
        <Button
          variant="outline"
          onClick={onClear}
          disabled={loading}
        >
          Limpiar
        </Button>
        <Button
          variant="ghost"
          onClick={onLoadSample}
          disabled={loading}
        >
          Cargar ejemplo
        </Button>
      </div>
      <Textarea
        id="yaml"
        value={yamlText}
        onChange={(e) => onYamlTextChange(e.target.value)}
        placeholder="Pega aquí tu DeploymentConfig en YAML"
        className="min-h-200 font-mono text-sm"
      />
      {error && <div className="text-destructive text-sm">{error}</div>}
    </div>
  );
};

