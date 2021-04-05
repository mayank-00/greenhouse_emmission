const path = require("path")
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const constants = require("constants");


const attachAsyncFunctionality = (db) => {
    db.asyncAll = function (query, params = []) {
        return new Promise((resolve, reject) => {

            db.all(query, params, (err, rows) => {
                if (err) {
                    return reject(err)
                }

                resolve(rows)
            })
        })
    }

    db.asyncRun = function (query, params = []) {
        return new Promise((resolve, reject) => {
            db.run(query, params, (err) => {

                if (err) {
                    return reject(err)
                }
                resolve('executed')
            })
        })
    }

    db.asyncGet = function (query, params = []) {
        return new Promise((resolve, reject) => {
            db.get(query, params, (err, row) => {
                if (err) {
                    return reject(err)
                }
                resolve(row)
            })
        })
    }
}

const createDatabase = async (db) => {

    try {

        if (!fs.existsSync(path.resolve(__dirname, "../../data/data.json")) || fs.existsSync(path.resolve(__dirname, "../../data/kaggle.db"))) {
            return
        }

        const createCountries = `CREATE TABLE countries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(50)
        )`, createCategories = `CREATE TABLE categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(150),
            description TEXT
        )`, createEmissionRecords = `CREATE TABLE emmissionRecords (
            record_id INTEGER PRIMARY KEY AUTOINCREMENT,
            country_id INTEGER,
            category_id INTEGER,
            value REAL,
            year INTEGER,
            FOREIGN KEY(country_id) REFERENCES countries(id),
            FOREIGN KEY(category_id) REFERENCES categories(id)
        )`

        await Promise.all([db.asyncRun(createCountries), db.asyncRun(createCategories), db.asyncRun(createEmissionRecords)])

        let insertIntoCountries = `INSERT INTO countries(name) VALUES`,
            insertIntoCategories = `INSERT INTO categories(name, description) VALUES`,
            uniqueCountries = new Map(),
            uniqueCategories = new Map()

        const data = require('data/data.json')

        for (let i = 0, len = data.length; i < len; i++) {
            let { country, category: description } = data[i]

            if (!uniqueCategories.has(description)) {
                uniqueCategories.set(description, "")
                insertIntoCategories += ` ('${constants.categoryDescriptionNameMapping[description]}', '${description}'),`
            }

            if (!uniqueCountries.has(country)) {
                uniqueCountries.set(country, "")
                insertIntoCountries += ` ('${country}'),`
            }
        }

        insertIntoCountries = insertIntoCountries.slice(0, insertIntoCountries.length - 1)
        insertIntoCategories = insertIntoCategories.slice(0, insertIntoCategories.length - 1)

        await Promise.all([db.asyncRun(insertIntoCountries), db.asyncRun(insertIntoCategories)])

        const getCountries = `SELECT * FROM countries`,
            getCategories = `SELECT * FROM categories`

        const ids = await Promise.all([db.asyncAll(getCategories), db.asyncAll(getCountries)])

        ids[0].forEach(row => {
            uniqueCategories.set(row.description, row.id)
        });

        ids[1].forEach(row => {
            uniqueCountries.set(row.name, row.id)
        })

        let insertIntoEmmissionRecords = `INSERT INTO emmissionRecords(country_id, category_id, value, year) Values`

        for (let i = 0, len = data.length; i < len; i++) {
            let { country, value, category, year } = data[i]

            insertIntoEmmissionRecords += ` (${uniqueCountries.get(country)}, ${uniqueCategories.get(category)}, ${value}, ${year}),`
        }

        insertIntoEmmissionRecords = insertIntoEmmissionRecords.slice(0, insertIntoEmmissionRecords.length - 1)

        await db.asyncRun(insertIntoEmmissionRecords)

        Promise.resolve('created')

    } catch (err) {
        console.log("err ", err)
    }

}

let db = new sqlite3.Database(path.resolve(__dirname, "../../data/kaggle.db"), err => {
    if (err) {
        console.log("database connection err: ", err)
        return
    }
    console.log("database connected successfully")
})

attachAsyncFunctionality(db)

createDatabase(db)

module.exports = db