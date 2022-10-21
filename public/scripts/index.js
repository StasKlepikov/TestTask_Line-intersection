const path = require('path');
app.use('/static', express.static(path.join(__dirname, 'public')));