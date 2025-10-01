import express from 'express';
import cors from 'cors';

import perusahaanRoutes from './routes/perusahaanRoutes.js';
import configBiayaAdminRoutes from './routes/configBiayaAdminRoutes.js';

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(cors({ 
    origin: '*', 
    credentials: false 
}));

app.use(express.json());

app.use('/api/perusahaan', perusahaanRoutes)
app.use('/api/config_biaya_admin', configBiayaAdminRoutes)

export default app;
