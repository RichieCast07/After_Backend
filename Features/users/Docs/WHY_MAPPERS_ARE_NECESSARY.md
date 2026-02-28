# 🔄 ¿Por qué son Necesarios los Mappers?

## 📋 Resumen Ejecutivo

**SÍ, los mappers son necesarios** y altamente recomendados. Son una práctica fundamental en aplicaciones profesionales.

---

## 🎯 Razones Principales

### 1. **Seguridad** 🔐

**Sin Mapper:**
```typescript
// ❌ PELIGROSO: Expone el password
async handle(req: Request, res: Response) {
    const user = await this.getUserUseCase.execute(id);
    res.json(user); // Incluye el password hasheado!
}
```

**Con Mapper:**
```typescript
// ✅ SEGURO: Sin password
async handle(req: Request, res: Response) {
    const user = await this.getUserUseCase.execute(id);
    const response = toUserResponseDTO(user); // Elimina password
    res.json(response);
}
```

**Resultado:**
```json
// Sin Mapper ❌
{
    "userID": 1,
    "email": "user@example.com",
    "password": "$2a$10$N9qo8uL..." // ⚠️ EXPUESTO!
}

// Con Mapper ✅
{
    "userID": 1,
    "email": "user@example.com"
    // password no está presente ✓
}
```

### 2. **Separación de Responsabilidades** 🏗️

Los mappers separan:
- **Modelo de Dominio** (interno) ↔ **Modelo de Presentación** (externo)

```typescript
// Modelo de Dominio (User)
interface User {
    userID: number;
    password: string;        // Necesario internamente
    internalFlags: string[]; // Detalles de implementación
    lastModified: Date;      // Metadata interna
}

// DTO (UserResponseDTO)
interface UserResponseDTO {
    userID: number;
    // Sin datos sensibles o internos
}
```

**Beneficio:** Puedes cambiar el modelo interno sin afectar la API externa.

### 3. **Contrato de API Claro** 📝

Los DTOs + Mappers documentan explícitamente qué se envía/recibe:

```typescript
// El tipo especifica exactamente qué campos se retornan
function toUserResponseDTO(user: User): UserResponseDTO {
    return {
        userID: user.userID,
        personaID: user.personaID,
        hotelID: user.hotelID,
        email: user.email,
        username: user.username,
        rol: user.rol,
        activo: user.activo,
        fechaRegistro: user.fechaRegistro
        // password NUNCA está aquí ✓
    };
}
```

### 4. **Transformación de Datos** 🔄

Los mappers pueden transformar datos:

```typescript
export function toUserResponseDTO(user: User): UserResponseDTO {
    return {
        userID: user.userID,
        email: user.email,
        username: user.username,
        // Transformaciones
        fullName: `${user.firstName} ${user.lastName}`,
        displayRole: user.rol.toUpperCase(),
        registrationDate: user.fechaRegistro.toISOString(),
        profileComplete: calculateProfileCompleteness(user)
    };
}
```

### 5. **Validación de Entradas** ✅

Mappers inversos validan que los datos de entrada sean correctos:

```typescript
export function fromRegisterDTOToUser(dto: RegisterUserDTO): User {
    // Asegura que el objeto User siempre tenga la estructura correcta
    return {
        userID: 0,
        personaID: dto.personaID,
        hotelID: dto.hotelID,
        email: dto.email.toLowerCase(), // Normalización
        password: dto.password,
        username: dto.username.trim(),  // Limpieza
        rol: dto.rol,
        activo: true,                   // Valor por defecto
        fechaRegistro: new Date()       // Calculado
    };
}
```

### 6. **Versionado de API** 🔢

Con mappers puedes soportar múltiples versiones:

```typescript
// API v1
function toUserResponseDTO_v1(user: User): UserResponseDTO_v1 {
    return { id: user.userID, name: user.username };
}

// API v2 (más campos)
function toUserResponseDTO_v2(user: User): UserResponseDTO_v2 {
    return { 
        userId: user.userID, 
        userName: user.username,
        email: user.email 
    };
}
```

---

## 🆚 Comparación: Con vs Sin Mappers

### Sin Mappers (Antipatrón)

```typescript
// ❌ Problemas:
// 1. Expone datos sensibles
// 2. Acopla dominio con API
// 3. Difícil de mantener
// 4. Cambios internos afectan API

async getUsers(req: Request, res: Response) {
    const users = await this.useCase.execute();
    res.json(users); // Retorna TODO, incluyendo passwords
}
```

**Problemas:**
- 🔴 Passwords expuestos
- 🔴 Campos internos visibles
- 🔴 Cambios en User rompen la API
- 🔴 Sin documentación clara del contrato

### Con Mappers (Buena Práctica)

```typescript
// ✅ Beneficios:
// 1. Solo datos seguros
// 2. Dominio separado de API
// 3. Fácil de mantener
// 4. API estable

async getUsers(req: Request, res: Response) {
    const users = await this.useCase.execute();
    const response = toUserResponseDTOArray(users); // Transforma
    res.json({ success: true, data: response });
}
```

**Beneficios:**
- ✅ Sin datos sensibles
- ✅ Contrato claro
- ✅ API estable
- ✅ Fácil testing

---

## 🔍 Ejemplo Real de Seguridad

### Escenario: Obtener información de usuario

**Sin Mapper:**
```json
GET /users/1

{
    "userID": 1,
    "username": "john.doe",
    "email": "john@example.com",
    "password": "$2a$10$abcdef123456...", // ⚠️ PROBLEMA
    "resetToken": "secret-token-xyz",     // ⚠️ PROBLEMA
    "internalNotes": "VIP customer"       // ⚠️ PROBLEMA
}
```

**Con Mapper:**
```json
GET /users/1

{
    "userID": 1,
    "username": "john.doe",
    "email": "john@example.com",
    "rol": "admin",
    "activo": true
}
```

---

## 📚 Mappers en tu Proyecto

Ya tienes mappers implementados en [dtos.ts](../Application/dtos.ts):

### Mappers Disponibles:

1. **`toUserResponseDTO(user: User): UserResponseDTO`**
   - Elimina password y datos sensibles
   - Usalo en todas las respuestas GET

2. **`toUserResponseDTOArray(users: User[]): UserResponseDTO[]`**
   - Versión para arrays
   - Usalo en GET /users

3. **`fromRegisterDTOToUser(dto: RegisterUserDTO): User`**
   - Convierte datos de entrada a modelo de dominio
   - Valida y normaliza datos

### Cómo Usarlos:

```typescript
// En GET /users
const users = await this.useCase.execute();
const response = toUserResponseDTOArray(users); // 👈 Mapper
res.json({ data: response });

// En GET /users/:id
const user = await this.useCase.execute(id);
const response = toUserResponseDTO(user); // 👈 Mapper
res.json({ data: response });

// En POST /register
const dto: RegisterUserDTO = req.body;
const userEntity = fromRegisterDTOToUser(dto); // 👈 Mapper
const newUser = await this.useCase.execute(userEntity);
```

---

## ✅ Handlers ya Implementados con Mappers

Todos estos handlers YA USAN mappers correctamente:

- ✅ [getUsersHandlerWithDTO.ts](../infrastructure/handlers/getUsersHandlerWithDTO.ts)
- ✅ [getUserByIDHandlerWithDTO.ts](../infrastructure/handlers/getUserByIDHandlerWithDTO.ts)
- ✅ [getUserByEmailHandlerWithDTO.ts](../infrastructure/handlers/getUserByEmailHandlerWithDTO.ts)
- ✅ [deleteUserHandlerWithDTO.ts](../infrastructure/handlers/deleteUserHandlerWithDTO.ts)
- ✅ [putUserHandlerWithDTO.ts](../infrastructure/handlers/putUserHandlerWithDTO.ts)
- ✅ [loginHandlerWithDTO.ts](../infrastructure/handlers/loginHandlerWithDTO.ts)
- ✅ [registerHandlerWithDTO.ts](../infrastructure/handlers/registerHandlerWithDTO.ts)

---

## 🚀 Cómo Usar los Handlers con DTOs

### Paso 1: Actualizar dependences.ts

```typescript
// ❌ Versión antigua (sin DTOs)
import { GetUsersHandler } from './handlers/getUserHandler.js';
const getUsersController = new GetUsersHandler(getUsersUseCase);

// ✅ Versión nueva (con DTOs)
import { GetUsersHandlerWithDTO } from './handlers/getUsersHandlerWithDTO.js';
const getUsersController = new GetUsersHandlerWithDTO(getUsersUseCase);
```

### Paso 2: Actualizar imports

```typescript
// En dependences.ts
import { 
    GetUsersHandlerWithDTO,
    GetUserByIDHandlerWithDTO,
    GetUserByEmailHandlerWithDTO,
    DeleteUserHandlerWithDTO,
    PutUserHandlerWithDTO,
    LoginHandlerWithDTO,
    RegisterHandlerWithDTO
} from './handlers/index.js';
```

### Paso 3: Crear instancias

```typescript
// Handlers con DTOs
const getUsersController = new GetUsersHandlerWithDTO(getUsersUseCase);
const getUserByIdController = new GetUserByIDHandlerWithDTO(getUserByIdUsecase);
const getUserByEmailController = new GetUserByEmailHandlerWithDTO(getUserByEmailUsecase);
const deleteUserController = new DeleteUserHandlerWithDTO(deleteUserUsecase);
const putUserController = new PutUserHandlerWithDTO(putUserUsecase);
const loginUserController = new LoginHandlerWithDTO(loginUserUsecase);
const registerUserController = new RegisterHandlerWithDTO(registerUserUseCase);
```

---

## 🎯 Conclusión

### ¿Son necesarios los mappers?

**Respuesta: SÍ, absolutamente.**

Los mappers:
1. ✅ **Protegen datos sensibles** (passwords, tokens)
2. ✅ **Separan dominio de API** (cambios internos no afectan API)
3. ✅ **Documentan el contrato** (tipos explícitos)
4. ✅ **Transforman datos** (formateo, cálculos)
5. ✅ **Facilitan testing** (datos predecibles)
6. ✅ **Mejoran mantenibilidad** (cambios localizados)

### ¿Cuándo usar mappers?

**Siempre** en aplicaciones profesionales. Especialmente:
- ✅ Antes de enviar respuestas HTTP
- ✅ Al recibir datos de entrada
- ✅ Al interactuar con APIs externas
- ✅ Al transformar entre capas

### ¿Cuándo NO usar mappers?

- ❌ Nunca en aplicaciones reales con datos sensibles
- ⚠️ Solo en prototipos temporales
- ⚠️ Solo en proyectos educativos muy simples

---

**Recomendación:** Usa **SIEMPRE** los handlers con DTOs (`*HandlerWithDTO`) en tu aplicación. Son más seguros, profesionales y mantenibles.

---

*Última actualización: 28 de Febrero, 2026*
