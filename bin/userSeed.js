
require('dotenv').config();

const mongoose = require('mongoose');
const User = require('../models/user');

const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

mongoose.connect(process.env.MONGODB_URI, {
  keepAlive: true,
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE
});

const users = [
  {
    username: 'camus',
    password: bcrypt.hashSync('1234', salt),
    history: ['Eiffel Tower']
  },
  {
    username: 'hume',
    password: bcrypt.hashSync('1234', salt),
    history: ['Casa Vicens', 'Casa Batlló']
  },
  {
    username: 'shopenhauer',
    password: bcrypt.hashSync('1234', salt),
    history: ['Casa Vicens', 'Casa Batlló']
  },
  {
    username: 'sartre',
    password: bcrypt.hashSync('1234', salt),
    history: ['Casa Vicens', 'Casa Batlló']
  },
  {
    username: 'seneca',
    password: bcrypt.hashSync('1234', salt),
    history: ['Casa Vicens', 'Casa Batlló']
  },
  {
    username: 'diogenese',
    password: bcrypt.hashSync('1234', salt),
    history: ['Casa Vicens', 'Sagrada Familia ', 'Casa Batlló']
  },
  {
    username: 'donald trump',
    password: bcrypt.hashSync('1234', salt),
    history: ['Great Wall of China', 'Western Wall']
  },
  {
    username: 'pete davidsons',
    password: bcrypt.hashSync('1234', salt),
    history: ['Casa Vicens', 'Sagrada Familia ', 'Casa Batlló']
  },
  {
    username: 'kanye west',
    password: bcrypt.hashSync('1234', salt),
    history: ['Casa Vicens', 'Sagrada Familia ', 'Arc de Triomf', 'Casa Batlló']
  },
  {
    username: 'logan paul',
    password: bcrypt.hashSync('1234', salt),
    history: ['Casa Vicens', 'Sagrada Familia ', 'Arc de Triomf', 'Casa Batlló']
  },
  {
    username: 'obama',
    password: bcrypt.hashSync('1234', salt),
    history: ['Casa Vicens', 'Sagrada Familia ', 'Arc de Triomf', 'Casa Batlló']
  }
];

User.create(users)
  .then(() => {
    mongoose.connection.close();
  })
  .catch(error => {
    console.error(error);
  });
