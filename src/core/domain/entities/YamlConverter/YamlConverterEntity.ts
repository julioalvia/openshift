/**
 * Entidad de dominio para la conversión de YAML
 */

export interface YamlConversionRequest {
  yamlContent: string;
}

export interface YamlConversionResponse {
  success: boolean;
  yamlOutput?: string;
  message?: string;
  error?: string;
}

export class YamlConverterEntity {
  readonly yamlContent: string;

  constructor(yamlContent: string) {
    this.yamlContent = yamlContent;
  }

  /**
   * Valida que el contenido YAML no esté vacío
   */
  isValid(): boolean {
    return this.yamlContent.trim().length > 0;
  }

  /**
   * Convierte la entidad a un objeto de solicitud
   */
  toRequest(): YamlConversionRequest {
    return {
      yamlContent: this.yamlContent,
    };
  }
}

/**
 * Constantes relacionadas con la conversión de YAML
 */
export const YAML_CONVERTER_CONSTANTS = {
  SAMPLE_YAML: `apiVersion: apps.openshift.io/v1
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
        beta.kubernetes.io/os: linux`,
} as const;

