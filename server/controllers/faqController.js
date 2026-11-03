const Faq = require('../models/Faq');
const crudFactory = require('../utils/crudFactory');

const getFaqs = crudFactory.getAll(Faq, {
  defaultFilter: { isActive: true },
  defaultSort: { order: 1, createdAt: 1 },
});

const getFaqById = crudFactory.getOneBySlugOrId(Faq);
const createFaq = crudFactory.createOne(Faq);
const updateFaq = crudFactory.updateOne(Faq);
const deleteFaq = crudFactory.deleteOne(Faq);

module.exports = {
  getFaqs,
  getFaqById,
  createFaq,
  updateFaq,
  deleteFaq,
};

