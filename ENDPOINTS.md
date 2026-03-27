EVENTS
GET    /events                  → Listar todos los eventos
GET    /events/:id              → Detalle de un evento
POST   /events                  → Crear nuevo evento
PUT    /events/:id              → Editar evento
PATCH  /events/:id/toggle       → Activar / desactivar evento
GET    /events/:eventId/ticket-types                         → Listar tipos de boleto del evento
POST   /events/:eventId/ticket-types                         → Crear tipo de boleto para el evento
PUT    /events/:eventId/ticket-types/:ticketTypeId           → Editar tipo de boleto (nombre/estado)

PHASES
GET    /events/:eventId/phases/:phaseId        → Listar fases de un evento
POST   /events/:eventId/phases                 → Crear fase
PUT    /events/:eventId/phases/:phaseId        → Editar fase
PATCH  /events/:eventId/phases/:phaseId/toggle → Activar / desactivar fase
GET    /events/:eventId/phases/:phaseId/ticket-types                    → Precios por tipo en la fase
PUT    /events/:eventId/phases/:phaseId/ticket-types/:ticketTypeId      → Actualizar precio por tipo en fase

CLIENTS
GET    /clients                                  → Listar clientes
GET    /clients/:id                            → Detalle de cliente
POST   /clients                                 → Crear cliente
GET    /clients/search?telefono=                → Buscar por teléfono
GET    /clients/export/csv                      → Descargar cartera CSV (incluye RP, evento y precio de compra)

TICKETS
POST   /tickets                                 → Vender boleto
GET    /tickets/:codigo                        → Buscar por código QR
GET    /tickets/public/:token                  → Ver boleto público (sin login)
PATCH  /tickets/:codigo/use                    → Marcar como USADO
GET    /tickets/event/:eventId                 → Todos los boletos de un evento
GET    /tickets/rp/:rpId                       → Boletos vendidos por un RP

METRICS
GET    /metrics/summary                        → Totales generales
GET    /metrics/rps                            → Ventas por RP
GET    /metrics/event/:eventId                 → Resumen de un evento
GET    /metrics/event/:eventId/phases          → Ventas por fase de un evento
