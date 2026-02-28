# Users Feature - TypeScript Migration

## 📋 Descripción

Este feature implementa la gestión de usuarios utilizando **Clean Architecture / Hexagonal Architecture** con TypeScript para aprovechar el tipado estático y mejorar la mantenibilidad del código.

## Arquitectura

La arquitectura sigue los principios de Clean Architecture con tres capas principales:

### Domain (Capa de Dominio)
- **`user.ts`**: Interface que define la entidad User
- **`userRepository.ts`**: Port/Interface que define el contrato del repositorio (Hexagonal Architecture Port)
- **`errors.ts`**: Clases personalizadas para manejo de errores HTTP con tipos seguros

### Application (Capa de Aplicación)
Contiene los casos de uso (lógica de negocio):

#### User Use Cases
- **`getUsersUseCase.ts`**: Obtener todos los usuarios
- **`getUserByIDUseCase.ts`**: Obtener usuario por ID
- **`getUserByEmailUseCase.ts`**: Obtener usuario por email
- **`createUserUseCase.ts`**: Crear nuevo usuario
- **`putUserUseCase.ts`**: Actualizar usuario existente
- **`deleteUserUseCase.ts`**: Eliminar usuario

#### Auth Use Cases
- **`loginUseCase.ts`**: Autenticación de usuario con JWT
- **`registerUserUseCase.ts`**: Registro de nuevo usuario con validación

### Infrastructure (Capa de Infraestructura)
Adaptadores que implementan los puertos definidos en Domain:

#### Repositories (Adapters)
- **`mysql.ts`**: Implementación del repositorio usando MySQL
- **`inMemory.ts`**: Implementación del repositorio en memoria (para testing)

#### Handlers (Controllers)
Manejan las peticiones HTTP y delegan a los casos de uso:
- `getUserHandler.ts`
- `getUserByIDHandler.ts`
- `getUserByEmailHandler.ts`
- `deleteUserHandler.ts`
- `putUserHandler.ts`
- `loginHandler.ts`
- `registerHandler.ts`
- `createUserHandler.ts`

#### Other Infrastructure Components
- **`userController.ts`**: Controlador principal que orquesta los handlers
- **`dependences.ts`**: Inyección de dependencias y configuración del módulo
- **`Routes/usersRoutes.ts`**: Definición de rutas REST

## 🎯 Buenas Prácticas Implementadas

### 1. **Tipado Fuerte**
```typescript
// Interfaces bien definidas
export interface User {
    userID: number;
    personaID: number;
    hotelID: number;
    email: string;
    password: string;
    username: string;
    rol: string;
    activo: boolean;
    fechaRegistro: Date;
}

// Tipado en parámetros y retornos
async execute(id: number): Promise<User>
```

### 2. **Inmutabilidad con readonly**
```typescript
private readonly userRepository: UserRepository;
```

### 3. **Dependency Injection**
Las dependencias se inyectan a través del constructor, facilitando testing y mantenibilidad:
```typescript
constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
}
```

### 4. **Manejo de Errores Tipado**
```typescript
// Uso de clases de error personalizadas
throw HttpErrors.notFound(`User with ID ${id} not found`);
throw HttpErrors.unauthorized('Invalid email or password');
throw HttpErrors.conflict('Email already in use');
```

### 5. **Separación de Responsabilidades**
- **Domain**: Define contratos y entidades (no depende de nada)
- **Application**: Implementa lógica de negocio (solo depende de Domain)
- **Infrastructure**: Implementa detalles técnicos (depende de Domain y Application)

### 6. **Barrel Exports**
Archivos `index.ts` en cada carpeta para facilitar importaciones:
```typescript
// En lugar de:
import { User } from '../../Domain/user.js';
import { UserRepository } from '../../Domain/userRepository.js';

// Puedes usar:
import { User, UserRepository } from '../../Domain/index.js';
```

### 7. **Async/Await**
Uso consistente de async/await para operaciones asíncronas:
```typescript
async execute(email: string): Promise<User> {
    const user = await this.userRepository.getUserByEmail(email);
    // ...
}
```

### 8. **Validación de Entrada**
```typescript
if (!userData || typeof userData.username !== 'string' || userData.username.trim() === '') {
    throw HttpErrors.badRequest('username is required and must be a non-empty string');
}
```

### 9. **Seguridad**
- Hashing de contraseñas con bcrypt
- Autenticación JWT
- Validación de datos de entrada

### 10. **Test-Friendly Architecture**
- Inyección de dependencias
- Repositorio en memoria para testing
- Interfaces bien definidas para mocking

## 🔄 Flujo de una Request

```
1. HTTP Request → Route (usersRoutes.ts)
2. Route → UserController method
3. UserController → Handler
4. Handler → Use Case (Application Layer)
5. Use Case → Repository (Domain Port)
6. Repository Implementation → Database/Memory
7. Response flows back through the layers
```

## 🚀 Inicialización

El módulo se inicializa en `dependences.ts`:

```typescript
import { init_users } from './Features/users/infrastructure/dependences.js';

// En tu app principal:
init_users(app);
```

## 🧪 Testing

El repositorio en memoria (`inMemory.ts`) permite testing sin base de datos:

```typescript
process.env.USE_IN_MEMORY = 'true';
// o
process.env.NODE_ENV = 'test';
```

## 📝 Convenciones de Código

1. **Nombres de Archivos**: camelCase con extensión `.ts`
2. **Nombres de Clases**: PascalCase
3. **Nombres de Variables**: camelCase
4. **Constantes**: camelCase para readonly, UPPER_SNAKE_CASE para const
5. **Interfaces**: PascalCase sin prefijo 'I'
6. **Tipos**: Siempre explícitos en firmas de funciones públicas
7. **Imports**: Usar extensión `.js` para archivos TypeScript (ESM standard)

## 🔐 Seguridad

- ✅ Passwords hasheadas con bcrypt (10 salt rounds)
- ✅ JWT tokens con expiración
- ✅ Validación de inputs
- ✅ Prevención de duplicados (email único)
- ✅ HTTP status codes apropiados

## 📦 Dependencias

- `bcryptjs`: Hashing de contraseñas
- `jsonwebtoken`: Autenticación JWT
- `express`: Framework web (tipos en handlers)

## 🎓 Principios SOLID Aplicados

- **S**ingle Responsibility: Cada clase tiene una única responsabilidad
- **O**pen/Closed: Abierto para extensión (nuevos adapters), cerrado para modificación
- **L**iskov Substitution: Los adapters son intercambiables
- **I**nterface Segregation: Interfaces específicas y cohesivas
- **D**ependency Inversion: Dependencia en abstracciones (UserRepository), no en implementaciones concretas

## 🚧 Próximas Mejoras

- [ ] DTOs (Data Transfer Objects) para requests/responses
- [ ] Validación con bibliotecas como Zod o class-validator
- [ ] Logger estructurado
- [ ] Tests unitarios y de integración
- [ ] OpenAPI/Swagger documentation
- [ ] Rate limiting
- [ ] Paginación en getUsers

---

**Autor**: Migrated to TypeScript following Clean Architecture principles
**Fecha**: 2026
