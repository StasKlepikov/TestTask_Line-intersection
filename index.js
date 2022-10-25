import express from 'express';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;
const cwd = process.cwd();
const staticFolder = path.join(cwd, 'public');

app.use('/', express.static(staticFolder));
app.listen(port, () => console.log(`Server is running on: http://localhost:${port}`));
