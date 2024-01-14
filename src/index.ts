import express from 'express';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;
const cwd = process.cwd();
const staticFolder = path.join(cwd, 'public');
const scriptsFolder = path.join(cwd, 'dist');

app.use('/', express.static(staticFolder));
app.use('/scripts', express.static(scriptsFolder));
app.listen(port, () => console.log(`Server is running on: http://localhost:${port}`));
