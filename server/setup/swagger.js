const express = require('express');

const router = express.Router();

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const config = require("configuration").getConfig()

const directoryPath = path.join(__dirname, '../../router/api');
const pathes = [];

const filesName = fs.readdirSync(directoryPath, (err, files) => {
    // handling error
    if (err) {
        return console.log(`Unable to scan directory: ${err}`);
    }
    // listing all files using forEach
    return files.forEach(file => pathes.push(file));
});
function getFullPathes(names) {
    names.forEach((name) => {
        let customePath;
        if (name !== 'index') {
            customePath = `./router/api/${name}`;
        }
        if (!(_.isUndefined(name))) {
            pathes.push(customePath);
        }
    });
}

getFullPathes(filesName);

const options = {
    swaggerDefinition: {
        components: {},
        info: {
            title: 'Greenhouse emmission records',
            version: '1.0.0',
            description: 'Greenhouse emmission records System,REST API with Swagger doc',
            contact: {
                email: 'jaiswal.mayank1412@gmail.com',
            },
        },
        tags: [
            {
                name: 'countries',
                description: 'Countries API',
            },
            {
                name: 'categories',
                description: 'Categories apis',
            },
            {
                name: 'emmissionRecords',
                description: 'for testing and sending emails ',
            },
        ],
        schemes: ['http', 'https'],
        host: `${config.HOST}:${process.env.PORT}`,
        basePath: config.BASE_PATH,
    },

    apis: pathes,
};
const swaggerSpec = swaggerJSDoc(options);

router.get('/json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

router.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = {
    router,
};