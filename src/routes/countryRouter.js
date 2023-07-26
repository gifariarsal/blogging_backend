const router = require("express").Router();

const { countryControllers } = require('../controllers')

router.get('/country', countryControllers.getCountry);

module.exports = router;