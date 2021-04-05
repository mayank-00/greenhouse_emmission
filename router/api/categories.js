const router = require('express').Router();
const CategoriesController = require("controllers/categories")
const { get } = require("utils/middlewares/cache")

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The category ID.
 *           example: 1
 *         name:
 *           type: string
 *           description: The category's name.
 *           example: carbon_dioxide_without_land_use
 *         description:
 *            type: string
 *            description: The category's description.
 *            example: carbon_dioxide_co2_emissions_without_land_use_land_use_change_and_forestry_lulucf_in_kilotonne_co2_equivalent
 */

/**
 * @swagger
 * /categories:
 *  get:
 *      summary: Retrives a complete list of categories
 *      tags:
 *          -   categories
 *      responses:
 *          '200':
 *              description: OK
 *              schema:
 *                  type: object
 *                  properties:
 *                      categories:
 *                          type: array
 *                          items:
 *                              $refs: "#/components/schemas/Category"
 *                           
 */

router.get('/', get('categories'), CategoriesController.getAllCategories)

module.exports = router