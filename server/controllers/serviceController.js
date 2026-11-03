const Service = require('../models/Service');
const crudFactory = require('../utils/crudFactory');

const getServices = crudFactory.getAll(Service, {
  defaultFilter: { isActive: true },
  defaultSort: { order: 1, title: 1 },
});

const getServiceBySlug = crudFactory.getOneBySlugOrId(Service);
const createService = crudFactory.createOne(Service);
const updateService = crudFactory.updateOne(Service);
const deleteService = crudFactory.deleteOne(Service);

module.exports = {
  getServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
};

