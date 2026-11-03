const Country = require('../models/Country');
const crudFactory = require('../utils/crudFactory');

const getCountries = crudFactory.getAll(Country, {
  defaultFilter: { isActive: true },
  defaultSort: { order: 1, name: 1 },
});

const getCountryBySlug = crudFactory.getOneBySlugOrId(Country);

const createCountry = crudFactory.createOne(Country);

const updateCountry = crudFactory.updateOne(Country);

const deleteCountry = crudFactory.deleteOne(Country);

module.exports = {
  getCountries,
  getCountryBySlug,
  createCountry,
  updateCountry,
  deleteCountry,
};

