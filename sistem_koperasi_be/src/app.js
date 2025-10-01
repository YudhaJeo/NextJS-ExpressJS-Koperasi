import express from 'express';
import cors from 'cors';

import perusahaanRoutes from './routes/perusahaanRoutes.js';
import rolesRoutes from './routes/rolesRoutes.js';

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(cors({ 
    origin: '*', 
    credentials: false 
}));

app.use(express.json());

app.use('/api/perusahaan', perusahaanRoutes)
app.use('/api/roles', rolesRoutes)


export default app;
