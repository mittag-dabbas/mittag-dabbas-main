'use strict';

/**
 * customer-referral service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::customer-referral.customer-referral');
