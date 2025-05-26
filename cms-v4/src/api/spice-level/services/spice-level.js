'use strict';

/**
 * spice-level service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::spice-level.spice-level');
