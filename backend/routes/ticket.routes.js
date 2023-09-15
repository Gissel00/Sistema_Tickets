const { Router } = require("express");
const ticketsController = require("../controllers/ticket.controller");
const verifyTickets = require("../middleware/verifier.tickets")
const verifyAccessLevel = require("../middleware/access.level");

const app = Router();

app.post("/tickets",
    [   
        verifyAccessLevel.isUser,
        verifyTickets.verifyAllRequiredFieldsForTicketCreation,
        verifyTickets.verifyIfCategoryExist,
        verifyTickets.verifyIfPriorityExist,
        verifyTickets.verifyIfWorkflowExist
    ],
    ticketsController.crearTicket
);

app.get("/tickets", 
    [
        verifyAccessLevel.isUser
    ],
    ticketsController.obtenerTickets
);

app.get("/tickets-by-user", 
    [
        verifyAccessLevel.isUser
    ],
    ticketsController.getTicketsByUser
);

app.get("/tickets/:id", 
    [
        verifyAccessLevel.isUser
    ],
    ticketsController.obtenerTicketPorId
);

app.put("/tickets/:id",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    ticketsController.actualizarTicket
);

app.delete("/tickets/eliminar/:id",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    ticketsController.cambiarDisponibilidadDeUnTicket
)

app.put("/ticket/restaurar/:id",
    [
        verifyAccessLevel.isAdmin,
        verifyAccessLevel.isUser
    ],
    ticketsController.cambiarDisponibilidadDeUnTicket
)

module.exports = app;

