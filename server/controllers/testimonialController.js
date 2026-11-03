const Testimonial = require('../models/Testimonial');
const crudFactory = require('../utils/crudFactory');

const getTestimonials = crudFactory.getAll(Testimonial, {
  defaultFilter: { isActive: true },
  defaultSort: { order: 1, createdAt: -1 },
});

const getTestimonialById = crudFactory.getOneBySlugOrId(Testimonial);
const createTestimonial = crudFactory.createOne(Testimonial);
const updateTestimonial = crudFactory.updateOne(Testimonial);
const deleteTestimonial = crudFactory.deleteOne(Testimonial);

module.exports = {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};

