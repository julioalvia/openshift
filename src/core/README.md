# Core - Arquitectura Limpia

Esta carpeta contiene la lógica de negocio del sistema siguiendo los principios de Clean Architecture.

## Estructura

### `/domain`
Contiene las entidades y casos de uso del negocio.

- **`/entities`**: Modelos de dominio que representan conceptos del negocio
- **`/useCases`**: Casos de uso que implementan la lógica de negocio

### `/application`
Capa de aplicación que coordina los casos de uso.

- **`/interfaces`**: Interfaces (contratos) para repositorios y casos de uso
- **`/services`**: Servicios de aplicación que orquestan los casos de uso

### `/infrastructure`
Implementaciones concretas de acceso a servicios externos.

- **`/apisDeclaration`**: Configuración de clientes HTTP (Axios)
- **`/repositories`**: Implementaciones de repositorios que acceden a APIs

## Principios

1. **Independencia de frameworks**: La lógica de negocio no depende de frameworks externos
2. **Testabilidad**: Los componentes son fáciles de probar gracias a la inyección de dependencias
3. **Independencia de la UI**: La lógica de negocio no conoce la capa de presentación
4. **Independencia de la base de datos**: La lógica de negocio no depende de detalles de persistencia

## Flujo de Dependencias

```
Presentation → Application (Services) → Domain (Use Cases) → Infrastructure (Repositories)
```

Las dependencias siempre apuntan hacia adentro (hacia el dominio).

