
module.exports = {
    getAllEmmissionRecords: async (req, res) => {

        try {
            let db = req.app.get('db')

            let emmissionRecords = await db.asyncAll(`SELECT * FROM emmissionRecords`)

            return res.status(200).json({ emmissionRecords })

        } catch (err) {
            console.error("getAllEmmissionRecords err: ---- ", err);
            return res.status(500).send()
        }
    },
    getEmmissionRecordById: async (req, res) => {

        try {
            let db = req.app.get('db')

            let memcached = req.app.get('memcached')

            let emmissionRecord = await db.asyncGet(`SELECT * FROM emmissionRecords where record_id=?`, [req.params.id])

            await memcached.asyncSet(`emmissionRecord-${req.params.id}`, emmissionRecord)

            return res.status(200).json({ emmissionRecord })

        } catch (err) {
            console.error("getAllEmmissionRecords err: ---- ", err);
            return res.status(500).send()
        }
    },
    getEmmissionRecordByCountryId: async (req, res) => {
        try {

            let db = req.app.get('db')

            let parameters = []

            let query = `SELECT  e.*
                , ca.name as country_name
                , co.name as category_name
                FROM emmissionRecords e
                INNER JOIN categories ca 
                ON e.category_id = ca.id
                INNER JOIN countries co
                ON e.country_id = co.id
                WHERE e.country_id = ?
            `

            if (req.query.categories) {
                let innerQuery = "SELECT id, name FROM categories WHERE"

                req.query.categories.split(',').forEach(category => {
                    innerQuery += ' name=? or'
                    parameters.push(category)
                });

                innerQuery = innerQuery.slice(0, innerQuery.length - 2)

                query = `SELECT e.*
                    , ca.name as country_name
                    , co.name as category_name
                    FROM (
                        ${innerQuery}
                    ) ca
                    INNER JOIN emmissionRecords e
                    ON e.category_id = ca.id
                    INNER JOIN countries co
                    ON e.country_id = co.id
                    WHERE e.country_id = ?
                `
            }

            parameters.push(req.params.country_id)

            if (req.query.start_year) {
                query += ' AND e.year>?'
                parameters.push(req.query.start_year - 1)
            }

            if (req.query.end_year) {
                query += ' AND e.year<?'
                parameters.push(req.query.end_year + 1)
            }

            const emmissionRecords = await db.asyncAll(query, parameters)

            return res.status(200).json({ emmissionRecords })
        } catch (err) {
            return res.status(500).send()
        }
    }
}