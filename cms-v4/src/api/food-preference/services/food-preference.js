'use strict';

/**
 * food-preference service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::food-preference.food-preference');
