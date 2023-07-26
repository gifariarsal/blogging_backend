const db = require('../models');
const country = db.blogCountry;

const countryControllers = {
    getCountry: async (req, res) => {
        try {
            const result = await country.findAll({
                attributes: { exclude: ["createdAt", "updatedAt"] }
            });
            res.status(200).json({ message: "Data found", data: result });
        } catch (error) {
            res.status(500).json({ message: "Data not found" });
        }
    }
};

module.exports = countryControllers;