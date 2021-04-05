const router = require('express').Router();

const { get } = require("utils/middlewares/cache")
const CountriesController = require("controllers/countries")

/**
 * @swagger
 * components:
 *   schemas:
 *     Country:
 *       type: object
 *       properties:
 *          id:
 *              type: integer
 *          name:
 *              type: string
 *     CountryEmmissionRecord:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *              name:
 *                  type: string
 *              category_id:
 *                  type: integer
 *              category_name:
 *                  type: string
 *              start_year:
 *                  type: integer
 *                  description: starting year from which records exist for specific country
 *              start_value:
 *                   type: number
 *                   description: value at starting year
 *              end_year:
 *                   type: integer
 *                   description: last year for which records exists
 *              end_value:
 *                   type: number
 *                   description: value at last year for which records exists
 */

/**
 * @swagger
 * /countries:
 *  get:
 *      summary: Retrives a complete list of countries
 *      tags:
 *          -   countries
 *      responses:
 *          '200':
 *              description: OK
 *              schema:
 *                  type: object
 *                  properties:
 *                      countries:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Country'
 * 
 */

router.get('/', get('countries'), CountriesController.getAllCountries)

/**
 * @swagger
 * /countries/records:
 *  get:
 *      summary: Retrives a complete list of countries among with start and end values with years
 *      tags:
 *          -   countries
 *      responses:
 *          '200':
 *              description: OK
 *              schema:
 *                  type: object
 *                  properties:
 *                      countries:
 *                          $ref: "#/components/schemas/CountryEmmissionRecord"
 */
router.get('/records', get('countries-records'), CountriesController.getAllRecords)

module.exports = router