"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//funcionalidad
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
//rutas
const indexRoutes_1 = __importDefault(require("./routes/indexRoutes"));
const edificiosRoutes_1 = __importDefault(require("./routes/edificiosRoutes"));
const rolesRoutes_1 = __importDefault(require("./routes/rolesRoutes"));
const responsablesRoutes_1 = __importDefault(require("./routes/responsablesRoutes"));
const reservasRoutes_1 = __importDefault(require("./routes/reservasRoutes"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
    }
    config() {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    routes() {
        this.app.use('/', indexRoutes_1.default);
        this.app.use('/edificios', edificiosRoutes_1.default);
        this.app.use('/roles', rolesRoutes_1.default);
        this.app.use('/responsables', responsablesRoutes_1.default);
        this.app.use('/reservas', reservasRoutes_1.default);
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port ', this.app.get('port'));
        });
    }
}
const server = new Server(); //ejecuta y devuelve un objeto
server.start();
