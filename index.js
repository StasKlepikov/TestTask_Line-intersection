import express from 'express';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use('/', express.static(path.join(process.cwd(), 'public')));
app.listen(process.env.PORT || 3000);
