SISTEMA DE BOLETOS - ARQUITECTURA IMPLEMENTADA

FEATURES CREADAS:
================

1. EVENTS (Eventos)
   ├── Domain/
   │   ├── Data/ (event.ts, createEventDTO.ts, updateEventDTO.ts, eventResponseDTO.ts)
   │   └── Repository/ (eventRepository.ts - puerto)
   ├── Application/
   │   ├── getEventsUseCase.ts
   │   ├── getEventByIdUseCase.ts
   │   ├── createEventUseCase.ts
   │   ├── updateEventUseCase.ts
   │   └── toggleEventStatusUseCase.ts
   └── infrastructure/
       ├── Repository/ (mysql.ts - adaptador)
       ├── handlers/ (5 handlers)
       ├── eventController.ts
       └── Routes/ (eventsRoutes.ts)

2. PHASES (Fases - Precios por etapa)
   ├── Domain/
   │   ├── Data/ (phase.ts, createPhaseDTO.ts, updatePhaseDTO.ts)
   │   └── Repository/ (phaseRepository.ts - puerto)
   ├── Application/
   │   ├── getPhasesByEventIdUseCase.ts
   │   ├── createPhaseUseCase.ts
   │   ├── updatePhaseUseCase.ts
   │   └── togglePhaseStatusUseCase.ts
   └── infrastructure/
       ├── Repository/ (mysql.ts - adaptador)
       ├── handlers/ (4 handlers)
       ├── phaseController.ts
       ├── Routes/ (phasesRoutes.ts)
       └── phasesRouter.ts (integración con events)

3. CLIENTS (Clientes sin login)
   ├── Domain/
   │   ├── Data/ (client.ts, createClientDTO.ts)
   │   └── Repository/ (clientRepository.ts - puerto)
   ├── Application/
   │   ├── getClientsUseCase.ts
   │   ├── getClientByIdUseCase.ts
   │   ├── getClientByPhoneUseCase.ts
   │   └── createClientUseCase.ts
   └── infrastructure/
       ├── Repository/ (mysql.ts - adaptador)
       ├── handlers/ (4 handlers)
       ├── clientController.ts
       └── Routes/ (clientsRoutes.ts)

4. TICKETS (Boletos)
   ├── Domain/
   │   ├── Data/ (ticket.ts, createTicketDTO.ts)
   │   └── Repository/ (ticketRepository.ts - puerto)
   ├── Application/
   │   ├── sellTicketUseCase.ts
   │   ├── getTicketByCodeUseCase.ts
   │   ├── markTicketAsUsedUseCase.ts
   │   ├── getTicketsByEventIdUseCase.ts
   │   └── getTicketsByRpIdUseCase.ts
   └── infrastructure/
       ├── Repository/ (mysql.ts - adaptador)
       ├── handlers/ (5 handlers)
       ├── ticketController.ts
       └── Routes/ (ticketsRoutes.ts)

5. METRICS (Métricas y reportes)
   ├── Domain/
   │   └── Data/ (metrics.ts - interfaces)
   ├── Application/
   │   └── metricsService.ts
   └── infrastructure/
       ├── handlers/ (4 handlers)
       ├── metricsController.ts
       └── Routes/ (metricsRoutes.ts)

PATRÓN ARQUITECTÓNICO:
====================
Clean Architecture / Hexagonal Architecture

- Domain Layer: Puertos (interfaces) y entidades aisladas de dependencias
- Application Layer: Lógica de negocio independiente del framework
- Infrastructure Layer: Adaptadores concretos (MySQL, Express)

INYECCIÓN DE DEPENDENCIAS:
==========================
Features/init.ts - Composición de todas las dependencias y rutas

FLUJO DE DATOS:
==============
HTTP Request → Handler → Use Case → Repository Port → MySQL Repository → SQL → Response

SEGURIDAD:
=========
- DTOs para validación de entrada
- Parametrizadas todas las queries (prevención de SQL injection)
- Control de tipos con TypeScript

ESCALABILIDAD:
==============
- Fácil agregar nuevos adaptadores (cambiar MySQL por PostgreSQL)
- Fácil agregar nuevos use cases sin afectar handlers
- Fácil agregar nuevas features siguiendo el mismo patrón
