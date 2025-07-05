import 'dotenv/config'
import express from 'express';
import logger from './logger.js';
import morgan from 'morgan';

const app = express();
const port = process.env.PORT || 3001;
app.use(express.json()); // Middleware to parse JSON bodies

const morganFormat = ':method :url :status :response-time ms';
// const morganFormat = ':method :url :status :res[content-length] - :response-time ms';

app.use(morgan(morganFormat, {
  stream: {
    write: (message) => {
      const logObject = {
        method: message.split(' ')[0],
        url: message.split(' ')[1],
        status: message.split(' ')[2],
        responseTime: message.split(' ')[3].replace('ms', ''),
      }
      // logger.info(message.trim());
      logger.info(JSON.stringify(logObject));
    }
  }
}));

let teaData = [];
let nextId = 1;

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).send("Wecome to Chai Hut!");
});

// Add a new tea
app.post('/teas', (req, res) => {
  const {name, price} = req.body;
  const newTea = { id: nextId++, name, price };
  teaData.push(newTea);
  res.status(201).send(newTea);
});

// Get all teas
app.get('/teas', (req, res) => {
  res.status(200).send(teaData);
});

// Get a specific tea by ID
app.get('/teas/:id', (req, res) => {
  const tea = teaData.find(t => t.id === parseInt(req.params.id));
  if (!tea) {
    return res.status(404).send("Tea not found");
  }
  res.status(200).send(tea);
});

// Update a specific tea by ID
app.put('/teas/:id', (req, res) => {
  const tea = teaData.find(t => t.id === parseInt(req.params.id));
  if (!tea) {
    return res.status(404).send("Tea not found");
  }
  const {name, price} = req.body;
  tea.name = name;
  tea.price = price;
  res.status(201).send(tea);
});

// Delete a specific tea by ID
app.delete('/teas/:id', (req, res) => {
  const index = teaData?.findIndex(t => t.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).send('Tea not found');
  }

  teaData.splice(index, 1);
  return res.status(204).send('Record deleted');
});


app.get('/ice-tea', (req, res) => {
  res.status(200).send("Ice tea is a refreshing drink!");
});
app.get('/twitter', (req, res) => {
  res.status(200).send("Follow me on Twitter @bmk");
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});