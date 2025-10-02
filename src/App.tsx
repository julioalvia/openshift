import { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
 
import { Button } from "@/components/animate-ui/components/buttons/button";
import { Loader2 } from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";

const SAMPLE_YAML = `apiVersion: apps.openshift.io/v1
kind: DeploymentConfig
metadata:
  name: carts-db
  labels:
    name: carts-db
spec:
  replicas: 1
  template:
    metadata:
      labels:
        name: carts-db
    spec:
      containers:
      - name: carts-db
        image: centos/mongodb-34-centos7
        ports:
        - name: mongo
          containerPort: 27017
        env:
        - name: MONGODB_USER
          value: sock-user
        - name: MONGODB_PASSWORD
          value: password
        - name: MONGODB_DATABASE
          value: data
        - name: MONGODB_ADMIN_PASSWORD
          value: admin
        volumeMounts:
        - mountPath: /tmp
          name: tmp-volume
      volumes:
      - name: tmp-volume
        emptyDir:
          medium: Memory
      nodeSelector:
        beta.kubernetes.io/os: linux`;

function App() {
  const [yamlText, setYamlText] = useState(SAMPLE_YAML);
  const [resultYaml, setResultYaml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const endpoint = useMemo(() => {
    const envUrl =
      (import.meta.env.VITE_CONVERT_URL as string | undefined) ||
      (import.meta.env.VITE_N8N_WEBHOOK_URL as string | undefined);
    return envUrl && envUrl.length > 0
      ? envUrl
      : "http://localhost:8000/convert";
  }, []);

  async function handleConvert() {
    setLoading(true);
    setError(null);
    setResultYaml(null);
    try {
      const resp = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ yaml_content: yamlText }),
      });

      if (!resp.ok) {
        const text = await resp.text().catch(() => "");
        throw new Error(text || `Error HTTP ${resp.status}`);
      }
      const contentType = resp.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await resp.json();
        const yamlOut =
          typeof data?.yaml_output === "string"
            ? data.yaml_output
            : JSON.stringify(data, null, 2);
        setResultYaml(yamlOut);
      } else {
        const textBody = await resp.text();
        setResultYaml(textBody);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Error desconocido";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setYamlText("");
    setResultYaml(null);
    setError(null);
  }

  function handleLoadSample() {
    setYamlText(SAMPLE_YAML);
    setResultYaml(null);
    setError(null);
  }

  function handleCopyOutput() {
    if (!resultYaml) return;
    navigator.clipboard.writeText(resultYaml).catch(() => {});
  }

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6 flex justify-center items-center">
      {/** Estado para badge de resultado */}
      {(() => {
        return null;
      })()}
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
            <div className="space-y-2">
              <Label htmlFor="yaml">DeploymentConfig (YAML)</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleConvert}
                  disabled={loading || yamlText.trim().length === 0}
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
                  onClick={handleClear}
                  disabled={loading}
                >
                  Limpiar
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleLoadSample}
                  disabled={loading}
                >
                  Cargar ejemplo
                </Button>
              </div>
              <Textarea
                id="yaml"
                value={yamlText}
                onChange={(e) => setYamlText(e.target.value)}
                placeholder="Pega aquí tu DeploymentConfig en YAML"
                className="min-h-200 font-mono text-sm"
              />
              {error && <div className="text-destructive text-sm">{error}</div>}
            </div>

            <div className="space-y-2">
              <Label>Resultado (YAML)</Label>

              <div className="flex items-center gap-2">
                {(() => {
                  const isLoading = loading;
                  const isOk = !loading && !!resultYaml;
                  let badgeText = "Sin datos";
                  let badgeClass = "bg-red-100 text-red-800 border-transparent";
                  if (isLoading) {
                    badgeText = "Convirtiendo…";
                    badgeClass = "bg-blue-100 text-blue-800 border-transparent";
                  } else if (isOk) {
                    badgeText = "Conversión lista";
                    badgeClass =
                      "bg-green-100 text-green-800 border-transparent";
                  }
                  return <Badge className={badgeClass}>{badgeText}</Badge>;
                })()}
                <Button
                  variant="outline"
                  onClick={handleCopyOutput}
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
}

export default App;

