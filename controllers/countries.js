
module.exports = {
    getAllCountries: async (req, res) => {

        try {
            let db = req.app.get('db')

            let memcached = req.app.get('memcached')


            let countries = await db.asyncAll(`SELECT * FROM countries`)
            await memcached.asyncSet('countries', countries)


            return res.status(200).json({ countries })

        } catch (err) {
            return res.status(500).send()
        }
    },
    getAllRecords: async (req, res) => {

        try {

            let db = req.app.get('db')
            let memcached = req.app.get('memcached')

            const getAllRecords = `
                SELECT b.country_id
                    , b.category_id
                    , b.value
                    , b.year
                FROM (
                    SELECT category_id
                        , country_id
                        , max(year) as max_year
                        , min(year) as min_year
                    FROM emmissionRecords
                    GROUP by country_id
                        , category_id
                ) a
                INNER JOIN emmissionRecords b 
                ON b.country_id = a.country_id 
                    and b.category_id = a.category_id 
                    and ( b.year = a.max_year or b.year = a.min_year )
            `

            let records = await db.asyncAll(getAllRecords)

            let countriesIdNameMap = {}, categoriesIdNameMap = {}

            try {
                countriesIdNameMap = await memcached.asyncGet('countries-id-name-mapping')
            } catch (err) {

                let countries = await db.asyncAll("SELECT * FROM countries")

                countries.forEach(row => {
                    if (countriesIdNameMap.hasOwnProperty(row.id)) return

                    countriesIdNameMap[row.id] = row.name
                })

                await memcached.asyncSet('countries-id-name-mapping', countriesIdNameMap)
            }

            try {
                categoriesIdNameMap = await memcached.asyncGet('categories-id-name-mapping')
            } catch (err) {
                let categories = await db.asyncAll("SELECT * FROM categories")

                categories.forEach(row => {
                    if (categoriesIdNameMap.hasOwnProperty(row.id)) return

                    categoriesIdNameMap[row.id] = row.name
                })

                await memcached.asyncSet('categories-id-name-mapping', categoriesIdNameMap)
            }



            let ret = [], checkMap = {}

            records.forEach((row, index) => {
                let { country_id, category_id } = row, str = `${country_id}-${category_id}`

                if (!checkMap.hasOwnProperty(str)) {
                    checkMap[str] = index
                    return
                }

                let row1 = records[index], data = {
                    id: country_id,
                    name: countriesIdNameMap[country_id],
                    category_id: category_id,
                    category_name: categoriesIdNameMap[category_id],
                }

                if (row1.year < row.year) {
                    data.start_year = row1.year
                    data.end_year = row.year
                    data.start_value = row1.value
                    data.end_value = row.value
                } else {
                    data.start_year = row.year
                    data.end_year = row1.year
                    data.start_value = row.value
                    data.end_value = row1.value
                }

                ret.push(data)

            });

            await memcached.asyncSet('countries-records', ret)

            return res.status(200).json({ countries: ret })

        } catch (err) {
            console.log("err ", err);
            return res.status(500).send()
        }
    },
}