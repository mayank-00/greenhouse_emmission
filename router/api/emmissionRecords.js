const router = require('express').Router();
const Joi = require('joi')
const validator = require('express-joi-validation').createValidator({})

const { get } = require("utils/middlewares/cache")
const { generalParams: { id, year, categories } } = require('utils/joi')
const ERecordController = require("controllers/emmissionRecords")

/**
 * @swagger
 * components:
 *   schemas:
 *     EmmissionRecord:
 *       type: object
 *       properties:
 *          id:
 *              type: integer
 *          category_id:
 *              type: integer
 *          country_id:
 *              type: integer
 *          year:
 *              type: integer
 *          value:
 *              type: number
 *     EmmissionRecordCountry:
 *       type: object
 *       properties:
 *          id:
 *              type: integer
 *          category_id:
 *              type: integer
 *          country_id:
 *              type: integer
 *          year:
 *              type: integer
 *          value:
 *              type: number
 *          category_name:
 *              type: string
 *          country_name:
 *              type: string
 */

/**
 * @swagger
 * /emmissionRecords:
 *  get:
 *      summary: Retrives a complete list of emmissionRecords
 *      tags:
 *          -   emmissionRecords
 *      responses:
 *          '200':
 *              description: OK
 *              schema:
 *                  type: object
 *                  properties:
 *                      emmmissionRecords:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/EmmissionRecord'
 *
 */

router.get('/', ERecordController.getAllEmmissionRecords)


/**
 * @swagger
 * /emmissionRecords/{id}:
 *  get:
 *      summary: Retrives a single emmissionRecord by id
 *      tags:
 *          -   emmissionRecords
 *      parameters:
 *          -   in: path
 *              name: id
 *              required: true
 *              description: Numeric id of emmissionRecord to retrieve.
 *              schema:
 *                  type: integer
 *      responses:
 *          200:
 *              description: ok
 *              schema:
 *                  type: object
 *                  properties:
 *                      emmissionRecord:
 *                          $ref: '#/components/schemas/EmmissionRecord'
*/

router.get('/:id',
    validator.params(Joi.object({ id: id })),
    get('emmissionRecord', 'id'),
    ERecordController.getEmmissionRecordById
)

/**
 * @swagger
 * /emmissionRecords/country/{country_id}:
 *  get:
 *      summary: get filtered records for a specific country
 *      tags:
 *          -   emmissionRecords
 *      parameters:
 *          -   in: path
 *              name: country_id
 *              required: true
 *              description: Numeric id of emmissionRecord to retrieve.
 *              schema:
 *                  type: integer
 *          -   in: query
 *              name: start_year
 *              description: Starting year to get records from
 *              schema:
 *                  type: integer
 *          -   in: query
 *              name: end_year
 *              description: Last year to get records upto
 *              schema:
 *                  type: integer
 *          -   in: query
 *              name: categories
 *              description: string of categories separated by ','
 *              schema:
 *                  type: string
 *      responses:
 *          '200':
 *              description: OK
 *              schema:
 *                  type: object
 *                  properties:
 *                      emmissionRecords:
 *                          type: array
 *                          items:
 *                              $ref: "#/components/schemas/EmmissionRecordCountry"
 */

router.get('/country/:country_id',
    validator.params(Joi.object({ country_id: id })),
    validator.query(Joi.object({ start_year: year, end_year: year, categories })),
    ERecordController.getEmmissionRecordByCountryId
)


module.exports = router