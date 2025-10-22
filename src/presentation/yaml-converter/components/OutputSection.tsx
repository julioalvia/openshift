import { Label } from "shared/components/ui/label";
import { Badge } from "shared/components/ui/badge";
import { Button } from "shared/components/animate-ui/components/buttons/button";
import { ScrollArea } from "shared/components/ui/scroll-area";
import { Textarea } from "shared/components/ui/textarea";

interface OutputSectionProps {
  resultYaml: string | null;
  loading: boolean;
  badgeStatus: {
    text: string;
    className: string;
  };
  onCopyOutput: () => void;
}

/**
 * Componente para la sección de salida del YAML convertido
 */
export const OutputSection = ({
  resultYaml,
  loading,
  badgeStatus,
  onCopyOutput,
}: OutputSectionProps) => {
  return (
    <div className="space-y-2">
      <Label>Resultado (YAML)</Label>

      <div className="flex items-center gap-2">
        <Badge className={badgeStatus.className}>{badgeStatus.text}</Badge>
        <Button
          variant="outline"
          onClick={onCopyOutput}
          disabled={!resultYaml || loading}
        >
          Copiar
        </Button>
      </div>

      <div className="border rounded-md p-2 bg-card">
        <ScrollArea className="h-195">
          {resultYaml ? (
            <Textarea
              id="yaml-output"
              value={resultYaml}
              readOnly
              className="font-mono text-sm min-h-180"
            />
          ) : (
            <div className="text-muted-foreground text-sm">
              — Esperando conversión —
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

