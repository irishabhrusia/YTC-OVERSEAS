const Partner = require('../models/Partner');
const crudFactory = require('../utils/crudFactory');

const getPartners = crudFactory.getAll(Partner, {
  defaultFilter: { isActive: true },
  defaultSort: { order: 1, name: 1 },
});

const getPartnerById = crudFactory.getOneBySlugOrId(Partner);
const createPartner = crudFactory.createOne(Partner);
const updatePartner = crudFactory.updateOne(Partner);
const deletePartner = crudFactory.deleteOne(Partner);

module.exports = {
  getPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
};

