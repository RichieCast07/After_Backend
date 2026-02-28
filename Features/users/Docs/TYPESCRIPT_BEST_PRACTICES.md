# TypeScript Best Practices - Guía Rápida

## 📚 Mejores Prácticas Aplicadas en la Migración

### 1. Tipado Estricto

```typescript
// ✅ BUENO: Tipos explícitos
async execute(id: number): Promise<User | null> {
    return this.repository.getUsersById(id);
}

// ❌ EVITAR: Tipos implícitos o any
async execute(id) {
    return this.repository.getUsersById(id);
}
```

### 2. Uso de Readonly para Inmutabilidad

```typescript
// ✅ BUENO: Propiedades inmutables
class UserService {
    private readonly repository: UserRepository;
    
    constructor(repository: UserRepository) {
        this.repository = repository;
    }
}

// ❌ EVITAR: Propiedades mutables que no deberían cambiar
class UserService {
    private repository: UserRepository;
}
```

### 3. Interfaces vs Types

```typescript
// ✅ BUENO: Interfaces para objetos y contratos
export interface User {
    userID: number;
    email: string;
}

// ✅ BUENO: Types para uniones, intersecciones, utilidades
export type UserRole = 'admin' | 'user' | 'guest';
export type PartialUser = Partial<User>;
```

### 4. Clases Abstractas para Puertos

```typescript
// ✅ BUENO: Clase abstracta para definir contrato
export abstract class UserRepository {
    abstract getUsers(): Promise<User[]>;
    abstract getUserById(id: number): Promise<User | null>;
}

// Implementación
export class MySQLUserRepository extends UserRepository {
    async getUsers(): Promise<User[]> {
        // implementación
    }
}
```

### 5. Manejo de Errores Tipado

```typescript
// ✅ BUENO: Clase de error personalizada
export class HttpError extends Error {
    constructor(
        message: string, 
        public readonly statusCode: number
    ) {
        super(message);
    }
}

throw new HttpError('Not found', 404);

// ❌ EVITAR: Error genérico con propiedades dinámicas
const err: any = new Error('Not found');
err.statusCode = 404;
throw err;
```

### 6. Dependency Injection

```typescript
// ✅ BUENO: Inyección explícita de dependencias
class LoginUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly tokenService: TokenService
    ) {}
}

// ❌ EVITAR: Crear dependencias internamente
class LoginUseCase {
    private userRepository = new MySQLUserRepository();
}
```

### 7. DTOs (Data Transfer Objects)

```typescript
// ✅ BUENO: DTO separado del modelo de dominio
export interface RegisterUserDTO {
    email: string;
    password: string;
    username: string;
}

export interface UserResponseDTO {
    userID: number;
    email: string;
    username: string;
    // Sin password!
}

// ❌ EVITAR: Exponer directamente el modelo de dominio
return userEntity; // incluye password
```

### 8. Async/Await sobre Promises

```typescript
// ✅ BUENO: Async/await para legibilidad
async function getUser(id: number): Promise<User> {
    const user = await repository.findById(id);
    if (!user) throw HttpErrors.notFound();
    return user;
}

// ❌ EVITAR: Cadenas de .then()
function getUser(id: number): Promise<User> {
    return repository.findById(id)
        .then(user => {
            if (!user) throw HttpErrors.notFound();
            return user;
        });
}
```

### 9. Validación de Entrada

```typescript
// ✅ BUENO: Validación explícita con mensajes claros
if (!email || !this.isValidEmail(email)) {
    throw HttpErrors.badRequest('Invalid email format');
}

// ✅ MEJOR: Usar librería de validación
import { z } from 'zod';

const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
});
```

### 10. Barrel Exports (index.ts)

```typescript
// En Domain/index.ts
export * from './user.js';
export * from './userRepository.js';
export * from './errors.js';

// Permite importaciones limpias
import { User, UserRepository, HttpErrors } from './Domain/index.js';
```

### 11. Tipos Utilitarios de TypeScript

```typescript
// Partial: Hace todas las propiedades opcionales
type UpdateUserData = Partial<User>;

// Pick: Selecciona propiedades específicas
type UserCredentials = Pick<User, 'email' | 'password'>;

// Omit: Excluye propiedades específicas
type UserWithoutPassword = Omit<User, 'password'>;

// Record: Crea tipo objeto con claves y valores específicos
type UserRoles = Record<'admin' | 'user' | 'guest', string[]>;
```

### 12. Null Safety

```typescript
// ✅ BUENO: Manejar explícitamente null/undefined
const user = await repository.findById(id);
if (!user) {
    throw HttpErrors.notFound('User not found');
}
return user; // TypeScript sabe que user no es null aquí

// ✅ BUENO: Optional chaining
const email = user?.profile?.email;

// ✅ BUENO: Nullish coalescing
const name = user.name ?? 'Anonymous';
```

### 13. Enums vs Union Types

```typescript
// ✅ BUENO: Union types para valores simples
export type UserRole = 'admin' | 'user' | 'guest';

// ✅ BUENO: Enums para valores con lógica asociada
export enum OrderStatus {
    Pending = 'PENDING',
    Processing = 'PROCESSING',
    Completed = 'COMPLETED'
}
```

### 14. Never Type para Cases Imposibles

```typescript
function assertNever(x: never): never {
    throw new Error('Unexpected value: ' + x);
}

function handleRole(role: UserRole) {
    switch (role) {
        case 'admin':
            return 'Admin access';
        case 'user':
            return 'User access';
        case 'guest':
            return 'Guest access';
        default:
            return assertNever(role); // Error si falta un case
    }
}
```

### 15. Type Guards

```typescript
// ✅ BUENO: Type guard personalizado
function isHttpError(error: unknown): error is HttpError {
    return error instanceof HttpError;
}

// Uso
try {
    // código
} catch (error) {
    if (isHttpError(error)) {
        res.status(error.statusCode).json({ message: error.message });
    } else {
        res.status(500).json({ message: 'Unknown error' });
    }
}
```

## 🔧 Configuración TSConfig Recomendada

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "outDir": "./dist",
    "rootDir": "./",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

## 📦 Librerías Recomendadas

### Validación
- **Zod**: Schema validation con inferencia de tipos
- **class-validator**: Validación basada en decoradores
- **Joi**: Schema validation tradicional

### Utilidades
- **type-fest**: Tipos utilitarios adicionales
- **ts-pattern**: Pattern matching para TypeScript
- **fp-ts**: Programación funcional tipada

### Testing
- **Vitest**: Test runner rápido con soporte TS
- **Jest**: Framework de testing popular
- **@faker-js/faker**: Generación de datos de prueba

## 🎯 Anti-Patrones a Evitar

### 1. Uso Excesivo de `any`
```typescript
// ❌ MAL
function processData(data: any): any {
    return data.map((item: any) => item.value);
}

// ✅ BIEN
function processData<T extends { value: string }>(data: T[]): string[] {
    return data.map(item => item.value);
}
```

### 2. Type Assertions Innecesarios
```typescript
// ❌ MAL
const user = getUser() as User;

// ✅ BIEN
const user = getUser(); // Ya tipado correctamente
```

### 3. Interfaces Vacías o Demasiado Genéricas
```typescript
// ❌ MAL
interface Data {}
interface Props extends Record<string, any> {}

// ✅ BIEN
interface UserData {
    id: number;
    name: string;
}
```

## 📚 Recursos Adicionales

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Total TypeScript](https://www.totaltypescript.com/)
- [Type Challenges](https://github.com/type-challenges/type-challenges)

---

**Recuerda**: El objetivo del tipado estático es **prevenir errores en tiempo de compilación**, no solo satisfacer al compilador. Piensa en los tipos como documentación ejecutable y contratos que hacen tu código más seguro y mantenible.
