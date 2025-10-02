import { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import YAML from "yaml";
import JsonView from "@uiw/react-json-view";
import { Button } from '@/components/animate-ui/components/buttons/button';
import { Loader2 } from "lucide-react";


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
  const [resultJson, setResultJson] = useState<
    Record<string, unknown> | unknown[] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const endpoint = useMemo(() => {
    const envUrl = import.meta.env.VITE_N8N_WEBHOOK_URL as string | undefined;
    if (import.meta.env.DEV) {
      // En dev usar proxy si no hay env definida
      return envUrl && envUrl.length > 0 ? envUrl : "/api/convert";
    }
    // En producción requiere estar definida
    return envUrl || "/api/convert";
  }, []);

  async function handleConvert() {
    setLoading(true);
    setError(null);
    setResultJson(null);
    try {
      const resp = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ DeploymentConfig: yamlText }),
      });

      if (!resp.ok) {
        const text = await resp.text().catch(() => "");
        throw new Error(text || `Error HTTP ${resp.status}`);
      }
      // La API puede devolver JSON, string JSON o YAML.
      let parsed: unknown;
      const contentType = resp.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        parsed = await resp.json();
        console.log("parsed 1", parsed);
      } else {
        const textBody = await resp.text();
        try {
          parsed = JSON.parse(textBody);
          console.log("parsed", parsed);
        } catch {
          try {
            parsed = YAML.parse(textBody);
            console.log("parsed", parsed);
          } catch {
            parsed = { raw: textBody };
          }
          console.log("parsed", parsed);
        }
      }
      // Algunas veces el flujo de n8n envuelve el objeto en { data: ... }
      // o retorna una cadena JSON dentro de una propiedad.
      const normalized = normalizeOutput(parsed);
      setResultJson(normalized);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Error desconocido";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setYamlText("");
    setResultJson(null);
    setError(null);
  }

  function handleLoadSample() {
    setYamlText(SAMPLE_YAML);
    setResultJson(null);
    setError(null);
  }

  function handleCopyOutput() {
    if (!resultJson) return;
    const pretty = JSON.stringify(resultJson, null, 2);
    navigator.clipboard.writeText(pretty).catch(() => {});
  }

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      {/** Estado para badge de resultado */}
      {(() => {
        return null
      })()}
      <Card>
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
              <Label>Resultado (JSON)</Label>

              <div className="flex items-center gap-2">
                {(() => {
                  const isLoading = loading;
                  const isOk = !loading && !!resultJson;
                  let badgeText = "Sin datos";
                  let badgeClass = "bg-red-100 text-red-800 border-transparent";
                  if (isLoading) {
                    badgeText = "Convirtiendo…";
                    badgeClass = "bg-blue-100 text-blue-800 border-transparent";
                  } else if (isOk) {
                    badgeText = "Conversión lista";
                    badgeClass = "bg-green-100 text-green-800 border-transparent";
                  }
                  return <Badge className={badgeClass}>{badgeText}</Badge>;
                })()}
                <Button
                  variant="outline"
                  onClick={handleCopyOutput}
                  disabled={!resultJson || loading}
                >
                  Copiar
                </Button>
              </div>
              <div className="border rounded-md p-2 bg-card">
                <ScrollArea className="h-195">
                  {resultJson ? (
                    <div className="text-left">
                      <JsonView
                        value={resultJson as any}
                        collapsed={false}
                        enableClipboard={false}
                        displayDataTypes={false}
                        displayObjectSize={false}
                      />
                    </div>
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
      </Card>
    </div>
  );
}

export default App;

// Normaliza diferentes formas de respuesta de n8n/webhook hacia un objeto/array JSON limpio
function normalizeOutput(input: unknown): Record<string, unknown> | unknown[] {
  // Si ya es objeto o array, intentamos detectar propiedades comunes
  if (Array.isArray(input)) return input;
  if (input && typeof input === "object") {
    const obj = input as Record<string, unknown>;
    // Desenrollar { data: ... }
    if (
      obj.data &&
      (typeof obj.data === "object" || typeof obj.data === "string")
    ) {
      const inner = tryParseUnknown(obj.data);
      return normalizeOutput(inner);
    }
    // Desenrollar { output: ... } o { result: ... }
    for (const key of ["output", "result", "payload"]) {
      if (obj[key] !== undefined) {
        return normalizeOutput(tryParseUnknown(obj[key]));
      }
    }
    return obj;
  }
  // Intentar parsear string JSON/YAML
  return tryParseUnknown(input);
}

function tryParseUnknown(value: unknown): Record<string, unknown> | unknown[] {
  if (typeof value === "string") {
    const text = value.trim();
    try {
      return JSON.parse(text);
    } catch {}
    try {
      return YAML.parse(text);
    } catch {}
    return [{ raw: text }];
  }
  if (value && typeof value === "object")
    return value as Record<string, unknown>;
  return [{ value }];
}
