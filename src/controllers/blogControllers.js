const db = require('../models');
const blog = db.blog;

const blogControllers = {
    getBlogById: async (req, res) => {
        const { id } = req.params;

        try {
            const blog = await blog.findOne({
                attributes: { exclude: ['categoryId'] },
                where: { id },
                include: [{ model: db.category }]
            });
            if (!blog) return res.status(404).json('Data not found');

            res.status(200).json({ message: 'Get blog data successfully', data: blog});
        } catch (error) {
            res.status(500).json({ message: 'Failed to get blog data'});
        }
    },

    createBlog: async (req, res) => {
        const {
            title,
            content,
            imgBlog,
            videoUrl,
            keywords,
            categoryId,
            countryId
        } = req.body;

        try {
            await db.sequelize.transaction(async (t) => {
                const res = await blog.create({
                    title,
                    content,
                    imgBlog,
                    videoUrl,
                    keywords,
                    categoryId,
                    countryId,
                    userId: req.user.id
                }, { transaction: t })
            });

            res.status(500).json({ message: 'Blog is created successfully', data: result});
        } catch (error) {
            res.status(500).json({ message: "Failed to create blog" });
        }
    },

    getBlogByQuery: async (req, res) => {
        const { title, categoryId, orderBy } = req.query;
        const whereClause = {
          title: { [db.Sequelize.Op.like]: `%${title || ""}%` },
        };

        if (categoryId) whereClause.categoryId = categoryId;

        try {
            const blogs = await blog.findAll({
                attributes: { exclude: ["categoryId"] },
                whereClause,
                include: [{ model: db.category }],
                order: [["createdAt", orderBy || "DESC"]],
            });

            res.status(200).json({ message: 'Get blog data successfully', data: blogs });

        } catch (error) {
            res.status(500).json({ message: 'Failed to get blog data'});
        }
    }
};

module.exports = blogControllers;