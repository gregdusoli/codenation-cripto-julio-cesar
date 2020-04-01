'use strict'

require('dotenv').config()
const { App } = require('./controllers/AppController')

// Criando instância da aplicação
const app = new App()
