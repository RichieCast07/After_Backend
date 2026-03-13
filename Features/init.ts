import type { Application } from "express";

import { GetEventsUseCase } from "../Features/events/Application/getEventsUseCase.js";
import { GetEventByIdUseCase } from "../Features/events/Application/getEventByIdUseCase.js";
import { CreateEventUseCase } from "../Features/events/Application/createEventUseCase.js";
import { UpdateEventUseCase } from "../Features/events/Application/updateEventUseCase.js";
import { ToggleEventStatusUseCase } from "../Features/events/Application/toggleEventStatusUseCase.js";

import { GetEventsHandler } from "../Features/events/infrastructure/handlers/getEventsHandler.js";
import { GetEventByIdHandler } from "../Features/events/infrastructure/handlers/getEventByIdHandler.js";
import { CreateEventHandler } from "../Features/events/infrastructure/handlers/createEventHandler.js";
import { UpdateEventHandler } from "../Features/events/infrastructure/handlers/updateEventHandler.js";
import { ToggleEventStatusHandler } from "../Features/events/infrastructure/handlers/toggleEventStatusHandler.js";

import { EventController } from "../Features/events/infrastructure/eventController.js";
import { createEventsRoutes } from "../Features/events/infrastructure/Routes/eventsRoutes.js";

import { MySQLEventRepository } from "../Features/events/infrastructure/Repository/mysql.js";

import { GetPhasesByEventIdUseCase } from "../Features/phases/Application/getPhasesByEventIdUseCase.js";
import { CreatePhaseUseCase } from "../Features/phases/Application/createPhaseUseCase.js";
import { UpdatePhaseUseCase } from "../Features/phases/Application/updatePhaseUseCase.js";
import { TogglePhaseStatusUseCase } from "../Features/phases/Application/togglePhaseStatusUseCase.js";

import { GetPhasesByEventIdHandler } from "../Features/phases/infrastructure/handlers/getPhasesByEventIdHandler.js";
import { CreatePhaseHandler } from "../Features/phases/infrastructure/handlers/createPhaseHandler.js";
import { UpdatePhaseHandler } from "../Features/phases/infrastructure/handlers/updatePhaseHandler.js";
import { TogglePhaseStatusHandler } from "../Features/phases/infrastructure/handlers/togglePhaseStatusHandler.js";

import { PhaseController } from "../Features/phases/infrastructure/phaseController.js";
import { MySQLPhaseRepository } from "../Features/phases/infrastructure/Repository/mysql.js";
import { registerPhasesRoutes } from "../Features/phases/infrastructure/phasesRouter.js";
import { GetClientByIdUseCase } from "../Features/clients/Application/getClientByIdUseCase.js";
import { GetClientByPhoneUseCase } from "../Features/clients/Application/getClientByPhoneUseCase.js";
import { CreateClientUseCase } from "../Features/clients/Application/createClientUseCase.js";
import { GetClientsUseCase } from "../Features/clients/Application/getClientsUseCase.js";

import { GetClientsHandler } from "../Features/clients/infrastructure/handlers/getClientsHandler.js";
import { GetClientByIdHandler } from "../Features/clients/infrastructure/handlers/getClientByIdHandler.js";
import { SearchClientByPhoneHandler } from "../Features/clients/infrastructure/handlers/searchClientByPhoneHandler.js";
import { CreateClientHandler } from "../Features/clients/infrastructure/handlers/createClientHandler.js";

import { ClientController } from "../Features/clients/infrastructure/clientController.js";
import { createClientsRoutes } from "../Features/clients/infrastructure/Routes/clientsRoutes.js";
import { MySQLClientRepository } from "../Features/clients/infrastructure/Repository/mysql.js";

import { SellTicketUseCase } from "../Features/tickets/Application/sellTicketUseCase.js";
import { GetTicketByCodeUseCase } from "../Features/tickets/Application/getTicketByCodeUseCase.js";
import { MarkTicketAsUsedUseCase } from "../Features/tickets/Application/markTicketAsUsedUseCase.js";
import { DeleteTicketByCodeUseCase } from "../Features/tickets/Application/deleteTicketByCodeUseCase.js";
import { GetTicketsByEventIdUseCase } from "../Features/tickets/Application/getTicketsByEventIdUseCase.js";
import { GetTicketsByRpIdUseCase } from "../Features/tickets/Application/getTicketsByRpIdUseCase.js";

import { SellTicketHandler } from "../Features/tickets/infrastructure/handlers/sellTicketHandler.js";
import { GetTicketByCodeHandler } from "../Features/tickets/infrastructure/handlers/getTicketByCodeHandler.js";
import { MarkTicketAsUsedHandler } from "../Features/tickets/infrastructure/handlers/markTicketAsUsedHandler.js";
import { DeleteTicketByCodeHandler } from "../Features/tickets/infrastructure/handlers/deleteTicketByCodeHandler.js";
import { GetTicketsByEventIdHandler } from "../Features/tickets/infrastructure/handlers/getTicketsByEventIdHandler.js";
import { GetTicketsByRpIdHandler } from "../Features/tickets/infrastructure/handlers/getTicketsByRpIdHandler.js";

import { TicketController } from "../Features/tickets/infrastructure/ticketController.js";
import { createTicketsRoutes } from "../Features/tickets/infrastructure/Routes/ticketsRoutes.js";
import { MySQLTicketRepository } from "../Features/tickets/infrastructure/Repository/mysql.js";

import { MetricsService } from "../Features/metrics/Application/metricsService.js";
import { GetOverallMetricsHandler } from "../Features/metrics/infrastructure/handlers/getOverallMetricsHandler.js";
import { GetRpMetricsHandler } from "../Features/metrics/infrastructure/handlers/getRpMetricsHandler.js";
import { GetEventMetricsHandler } from "../Features/metrics/infrastructure/handlers/getEventMetricsHandler.js";
import { GetEventPhaseMetricsHandler } from "../Features/metrics/infrastructure/handlers/getEventPhaseMetricsHandler.js";
import { MetricsController } from "../Features/metrics/infrastructure/metricsController.js";
import { createMetricsRoutes } from "../Features/metrics/infrastructure/Routes/metricsRoutes.js";

export function initFeatures(app: Application): void {
    const eventRepository = new MySQLEventRepository();
    const phaseRepository = new MySQLPhaseRepository();
    const clientRepository = new MySQLClientRepository();
    const ticketRepository = new MySQLTicketRepository();
    const metricsService = new MetricsService();

    const getEventsUseCase = new GetEventsUseCase(eventRepository);
    const getEventByIdUseCase = new GetEventByIdUseCase(eventRepository);
    const createEventUseCase = new CreateEventUseCase(eventRepository);
    const updateEventUseCase = new UpdateEventUseCase(eventRepository);
    const toggleEventStatusUseCase = new ToggleEventStatusUseCase(eventRepository);

    const getEventsHandler = new GetEventsHandler(getEventsUseCase);
    const getEventByIdHandler = new GetEventByIdHandler(getEventByIdUseCase);
    const createEventHandler = new CreateEventHandler(createEventUseCase);
    const updateEventHandler = new UpdateEventHandler(updateEventUseCase);
    const toggleEventStatusHandler = new ToggleEventStatusHandler(toggleEventStatusUseCase);

    const eventController = new EventController(
        getEventsHandler,
        getEventByIdHandler,
        createEventHandler,
        updateEventHandler,
        toggleEventStatusHandler,
        eventRepository
    );

    const getPhasesByEventIdUseCase = new GetPhasesByEventIdUseCase(phaseRepository);
    const createPhaseUseCase = new CreatePhaseUseCase(phaseRepository);
    const updatePhaseUseCase = new UpdatePhaseUseCase(phaseRepository);
    const togglePhaseStatusUseCase = new TogglePhaseStatusUseCase(phaseRepository);

    const getPhasesByEventIdHandler = new GetPhasesByEventIdHandler(getPhasesByEventIdUseCase);
    const createPhaseHandler = new CreatePhaseHandler(createPhaseUseCase);
    const updatePhaseHandler = new UpdatePhaseHandler(updatePhaseUseCase);
    const togglePhaseStatusHandler = new TogglePhaseStatusHandler(togglePhaseStatusUseCase);

    const phaseController = new PhaseController(
        getPhasesByEventIdHandler,
        createPhaseHandler,
        updatePhaseHandler,
        togglePhaseStatusHandler,
        phaseRepository
    );

    const getClientsUseCase = new GetClientsUseCase(clientRepository);
    const getClientByIdUseCase = new GetClientByIdUseCase(clientRepository);
    const getClientByPhoneUseCase = new GetClientByPhoneUseCase(clientRepository);
    const createClientUseCase = new CreateClientUseCase(clientRepository);

    const getClientsHandler = new GetClientsHandler(getClientsUseCase);
    const getClientByIdHandler = new GetClientByIdHandler(getClientByIdUseCase);
    const searchClientByPhoneHandler = new SearchClientByPhoneHandler(getClientByPhoneUseCase);
    const createClientHandler = new CreateClientHandler(createClientUseCase);

    const clientController = new ClientController(
        getClientsHandler,
        getClientByIdHandler,
        searchClientByPhoneHandler,
        createClientHandler,
        clientRepository
    );

    const sellTicketUseCase = new SellTicketUseCase(ticketRepository, clientRepository, phaseRepository, eventRepository);
    const getTicketByCodeUseCase = new GetTicketByCodeUseCase(ticketRepository);
    const markTicketAsUsedUseCase = new MarkTicketAsUsedUseCase(ticketRepository);
    const deleteTicketByCodeUseCase = new DeleteTicketByCodeUseCase(ticketRepository);
    const getTicketsByEventIdUseCase = new GetTicketsByEventIdUseCase(ticketRepository);
    const getTicketsByRpIdUseCase = new GetTicketsByRpIdUseCase(ticketRepository);

    const sellTicketHandler = new SellTicketHandler(sellTicketUseCase);
    const getTicketByCodeHandler = new GetTicketByCodeHandler(getTicketByCodeUseCase);
    const markTicketAsUsedHandler = new MarkTicketAsUsedHandler(markTicketAsUsedUseCase);
    const deleteTicketByCodeHandler = new DeleteTicketByCodeHandler(deleteTicketByCodeUseCase);
    const getTicketsByEventIdHandler = new GetTicketsByEventIdHandler(getTicketsByEventIdUseCase);
    const getTicketsByRpIdHandler = new GetTicketsByRpIdHandler(getTicketsByRpIdUseCase);

    const ticketController = new TicketController(
        sellTicketHandler,
        getTicketByCodeHandler,
        markTicketAsUsedHandler,
        getTicketsByEventIdHandler,
        getTicketsByRpIdHandler,
        deleteTicketByCodeHandler
    );

    const getOverallMetricsHandler = new GetOverallMetricsHandler(metricsService);
    const getRpMetricsHandler = new GetRpMetricsHandler(metricsService);
    const getEventMetricsHandler = new GetEventMetricsHandler(metricsService);
    const getEventPhaseMetricsHandler = new GetEventPhaseMetricsHandler(metricsService);

    const metricsController = new MetricsController(
        getOverallMetricsHandler,
        getRpMetricsHandler,
        getEventMetricsHandler,
        getEventPhaseMetricsHandler
    );

    const eventsRoutes = createEventsRoutes(eventController);
    const clientsRoutes = createClientsRoutes(clientController);
    const ticketsRoutes = createTicketsRoutes(ticketController);
    const metricsRoutes = createMetricsRoutes(metricsController);

    app.use("/events", eventsRoutes);
    registerPhasesRoutes(app, phaseController);
    app.use("/clients", clientsRoutes);
    app.use("/tickets", ticketsRoutes);
    app.use("/metrics", metricsRoutes);

    console.log("Features initialized");
}
