"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const hotel_routes_1 = __importDefault(require("./routes/hotel.routes"));
const hotelOwner_routes_1 = __importDefault(require("./routes/hotelOwner.routes"));
const booking_routes_1 = __importDefault(require("./routes/booking.routes"));
const morgan_1 = __importDefault(require("morgan"));
const errorMiddleWare_1 = require("./middleware/errorMiddleWare");
const db_1 = __importDefault(require("./config/db"));
(0, db_1.default)();
(0, dotenv_1.config)();
const upload = (0, multer_1.default)();
let PORT = process.env.PORT || '5000';
const app = (0, express_1.default)();
const baseAPI = '/api/v1';
app.use((0, cors_1.default)({
    origin: '*',
    methods: '*',
}));
if (process.env.NODE_ENV === 'development')
    app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use((0, compression_1.default)({
    level: 6,
    threshold: 1024 * 10,
}));
app.use(upload.array('images', 5));
app.use(`${baseAPI}/user`, user_routes_1.default);
app.use(`${baseAPI}/hotel-owner`, hotelOwner_routes_1.default);
app.use(`${baseAPI}/hotel`, hotel_routes_1.default);
app.use(`${baseAPI}/booking`, booking_routes_1.default);
app.use(`${baseAPI}/admin`, admin_routes_1.default);
const dirname = path_1.default.resolve();
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static(path_1.default.join(dirname, '/frontend/build')));
    app.get('*', (req, res, next) => res.sendFile('index.html', { root: path_1.default.join(dirname, '/frontend/build') }, (err) => {
        if (err) {
            console.log(err);
            next(err);
        }
    }));
}
else {
    app.get('/', (req, res) => {
        res.send('API is running....');
    });
}
app.use(errorMiddleWare_1.notFound);
app.use(errorMiddleWare_1.errorHandler);
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
