const db = require('../models');
const blog = db.blog;
const category = db.blogCategory;
const country = db.blogCountry;
const { Op } = db.Sequelize;

const blogControllers = {
    getBlogById: async (req, res) => {
        try {
            const blogs = await blog.findOne({
                attributes: { exclude: ["categoryId", "countryId"] },
                where: { id: req.params.id },
                include: [
                    { model: category, attributes: { exclude: ["createdAt", "updatedAt"] } },
                    { model: country, attributes: { exclude: ["createdAt", "updatedAt"] } },
                ]
            });
            if (!blogs) return res.status(404).json('Data not found');

            res.status(200).json({ message: 'Get blog data successfully', data: blogs});
        } catch (error) {
            res.status(500).json({ message: 'Failed to get blog data', error: error.message });
        }
    },

    createBlog: async (req, res) => {
        try {
            const { title, content, imgBlog, videoUrl, keywords, categoryId, countryId } = req.body;
            await db.sequelize.transaction(async (t) => {
                const result = await blog.create({
                    title,
                    content,
                    imgBlog: req.file.path,
                    videoUrl,
                    keywords,
                    categoryId,
                    countryId,
                    userId: req.user.id
                }, { transaction: t })
                res.status(500).json({ message: "Blog is created successfully", data: result});
            });
        } catch (error) {
            res.status(500).json({ message: "Failed to create blog", error: error.message });
        }
    },

    getBlog: async (req, res) => {
        const { title, categoryId, orderBy, size, page } = req.query;
        const limitPerPage = parseInt(size) || 10;
        const pageNumber = parseInt(page) || 1;
        const offset = (pageNumber - 1) * limitPerPage;
        const findTitle = {title: { [ Op.like ]: `%${title || ""}%` }}
        if (categoryId) findTitle.categoryId = categoryId;
        try {
            const blogs = await blog.findAll({
                attributes: { exclude: ["categoryId", "countryId"] },
                where: findTitle,
                limit: limitPerPage,
                blogPage: pageNumber,
                offset,
                include: [
                    { model: category, attributes: { exclude: ["createdAt", "updatedAt"] } },
                    { model: country, attributes: { exclude: ["createdAt", "updatedAt"] } },
            ],
                order: [["createdAt", orderBy || "DESC"]],
            });
            res.status(200).json({ message: "Get blog data successfully", listLimit: limitPerPage, blogPage: pageNumber, data: blogs });
        } catch (error) {
            res.status(500).json({ message: "Failed to get blog data", error: error.message });
        }
    }
};

module.exports = blogControllers;