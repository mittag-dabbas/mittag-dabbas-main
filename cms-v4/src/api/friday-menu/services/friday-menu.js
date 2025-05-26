'use strict';

/**
 * friday-menu service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::friday-menu.friday-menu');
