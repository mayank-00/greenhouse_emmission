
module.exports = {
    getAllCategories: async (req, res) => {

        try {

            let db = req.app.get('db')

            let memcached = req.app.get('memcached')

            let categories = await db.asyncAll(`SELECT * FROM categories`)

            await memcached.asyncSet('categories', categories)

            return res.status(200).json({ categories })

        } catch (err) {
            console.log("getAllCategories error: ", err)
            return res.status(500).send(err)
        }
    }
}
