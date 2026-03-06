EVENTS
GET    /events                  → Listar todos los eventos
GET    /events/:id              → Detalle de un evento
POST   /events                  → Crear nuevo evento
PUT    /events/:id              → Editar evento
PATCH  /events/:id/toggle       → Activar / desactivar evento

PHASES
GET    /events/:eventId/phases/:phaseId        → Listar fases de un evento
POST   /events/:eventId/phases                 → Crear fase
PUT    /events/:eventId/phases/:phaseId        → Editar fase
PATCH  /events/:eventId/phases/:phaseId/toggle → Activar / desactivar fase

CLIENTS
GET    /clients                                  → Listar clientes
GET    /clients/:id                            → Detalle de cliente
POST   /clients                                 → Crear cliente
GET    /clients/search?telefono=                → Buscar por teléfono

TICKETS
POST   /tickets                                 → Vender boleto
GET    /tickets/:codigo                        → Buscar por código QR
PATCH  /tickets/:codigo/use                    → Marcar como USADO
GET    /tickets/event/:eventId                 → Todos los boletos de un evento
GET    /tickets/rp/:rpId                       → Boletos vendidos por un RP

METRICS
GET    /metrics/summary                        → Totales generales
GET    /metrics/rps                            → Ventas por RP
GET    /metrics/event/:eventId                 → Resumen de un evento
GET    /metrics/event/:eventId/phases          → Ventas por fase de un evento
