const Course = require('../models/Course');
const crudFactory = require('../utils/crudFactory');

const getCourses = crudFactory.getAll(Course, {
  defaultFilter: { isActive: true },
  populate: { path: 'countries', select: 'name slug code' },
  defaultSort: { order: 1, name: 1 },
});

const getCourseBySlug = crudFactory.getOneBySlugOrId(Course, {
  populate: { path: 'countries', select: 'name slug code' },
});

const createCourse = crudFactory.createOne(Course);
const updateCourse = crudFactory.updateOne(Course);
const deleteCourse = crudFactory.deleteOne(Course);

module.exports = {
  getCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
};

