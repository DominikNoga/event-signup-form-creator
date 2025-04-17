const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const eventRoutes = require('./routes/events');
const registrationRoutes = require('./routes/registrations');
const verificationRoutes = require('./routes/verification');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/events', eventRoutes);
app.use('/api/register', registrationRoutes);
app.use('/api/verify', verificationRoutes);

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
