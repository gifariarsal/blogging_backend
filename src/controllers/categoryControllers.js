const db = require('../models');
const category = db.blogCategory;

const categoryController = {
    getCategory: async (req, res) => {
        try {
            const result = await category.findAll({
                attributes: { exclude: ["createdAt", "updatedAt"] }
            });
            res.status(200).json({ message: "Data found", data: result});
        } catch (error) {
            res.status(500).json({ message: "Data not found", error: error.message });
        }
    }
};

module.exports = categoryController;