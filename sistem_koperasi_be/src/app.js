import express from 'express';
import cors from 'cors';

import aktivasiMpayRoutes from './routes/aktivasiMpayRoutes.js';
import perusahaanRoutes from './routes/perusahaanRoutes.js';
import rolesRoutes from './routes/rolesRoutes.js';
import configBiayaAdminRoutes from './routes/configBiayaAdminRoutes.js';
import aktivasiMbankingRoutes from './routes/aktivasiMbankingRoutes.js';
import simpananRoutes from './routes/simpananRoutes.js';
import laporanmbankingRoutes from './routes/laporanMbankingRoutes.js';

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(cors({ 
    origin: '*', 
    credentials: false 
}));

app.use(express.json());

app.use('/api/aktivasi_mpay', aktivasiMpayRoutes)
app.use('/api/perusahaan', perusahaanRoutes)
app.use('/api/roles', rolesRoutes)
app.use('/api/laporan_mbanking', laporanmbankingRoutes)
app.use('/api/config_biaya_admin', configBiayaAdminRoutes)
app.use('/api/aktivasi_mbanking', aktivasiMbankingRoutes)
app.use('/api/simpanan', simpananRoutes)

export default app;
