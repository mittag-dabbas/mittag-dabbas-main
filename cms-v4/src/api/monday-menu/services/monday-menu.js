'use strict';

/**
 * monday-menu service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::monday-menu.monday-menu');
