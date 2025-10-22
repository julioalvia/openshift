import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "shared/components/ui/card";
import { Separator } from "shared/components/ui/separator";
import { Badge } from "shared/components/ui/badge";
import { BorderBeam } from "shared/components/ui/border-beam";
import { useYamlConverter } from "./hooks/useYamlConverter";
import { InputSection } from "./components/InputSection";
import { OutputSection } from "./components/OutputSection";

/**
 * Componente principal para la conversión de YAML
 * Migra DeploymentConfig de OpenShift v3 a Deployment de v4
 */
export const YamlConverter = () => {
  const {
    yamlText,
    resultYaml,
    loading,
    error,
    endpoint,
    setYamlText,
    handleConvert,
    handleClear,
    handleLoadSample,
    handleCopyOutput,
    getBadgeStatus,
  } = useYamlConverter();

  const badgeStatus = getBadgeStatus();

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6 flex justify-center items-center">
      <Card className="relative w-[1024px] overflow-hidden">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <CardTitle>Migrador OpenShift v3 → v4</CardTitle>
              <CardDescription>
                Ingrese su DeploymentConfig (YAML) de OpenShift v3. Se
                convertirá a un Deployment de OpenShift/Kubernetes v4.
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge>Demo</Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputSection
              yamlText={yamlText}
              loading={loading}
              error={error || null}
              onYamlTextChange={setYamlText}
              onConvert={handleConvert}
              onClear={handleClear}
              onLoadSample={handleLoadSample}
            />

            <OutputSection
              resultYaml={resultYaml ?? null}
              loading={loading}
              badgeStatus={badgeStatus}
              onCopyOutput={handleCopyOutput}
            />
          </div>

          <Separator />

          <div className="text-xs text-muted-foreground">
            Endpoint: {endpoint}
          </div>
        </CardContent>

        <CardFooter />

        <BorderBeam
          duration={8}
          size={100}
          className="from-transparent via-green-500 to-transparent"
        />
      </Card>
    </div>
  );
};

