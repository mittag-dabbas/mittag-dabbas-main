import type { Schema, Attribute } from '@strapi/strapi';

export interface SharedStrip extends Schema.Component {
  collectionName: 'components_shared_strips';
  info: {
    displayName: 'Strip';
    description: '';
  };
  attributes: {};
}

export interface SharedSeo extends Schema.Component {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'seo';
    icon: 'search';
  };
  attributes: {
    metaTitle: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    metaDescription: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 50;
        maxLength: 160;
      }>;
    metaImage: Attribute.Media<'images' | 'files' | 'videos'>;
    metaSocial: Attribute.Component<'shared.meta-social', true>;
    keywords: Attribute.Text;
    metaRobots: Attribute.String;
    structuredData: Attribute.JSON;
    metaViewport: Attribute.String;
    canonicalURL: Attribute.String;
  };
}

export interface SharedMetaSocial extends Schema.Component {
  collectionName: 'components_shared_meta_socials';
  info: {
    displayName: 'metaSocial';
    icon: 'project-diagram';
  };
  attributes: {
    socialNetwork: Attribute.Enumeration<['Facebook', 'Twitter']> &
      Attribute.Required;
    title: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    description: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 65;
      }>;
    image: Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedEmail extends Schema.Component {
  collectionName: 'components_shared_emails';
  info: {
    displayName: 'Email';
  };
  attributes: {
    Email: Attribute.Email;
  };
}

export interface SharedDiscountPercentage extends Schema.Component {
  collectionName: 'components_shared_discount_percentages';
  info: {
    displayName: 'DiscountPercentage';
    description: '';
  };
  attributes: {
    Discount: Attribute.Integer;
  };
}

export interface SharedDiscountAmount extends Schema.Component {
  collectionName: 'components_shared_discount_amounts';
  info: {
    displayName: 'DiscountAmount';
    description: '';
  };
  attributes: {
    Discount: Attribute.Float;
  };
}

export interface SharedDayItems extends Schema.Component {
  collectionName: 'components_shared_day_items';
  info: {
    displayName: 'DayItems';
    icon: 'cup';
    description: '';
  };
  attributes: {
    Name: Attribute.String;
    Description: Attribute.Text;
    TotalPrice: Attribute.String;
    quantity: Attribute.String;
    Allergens: Attribute.String;
    FoodPreference: Attribute.String;
    SpiceLevel: Attribute.String;
    Categories: Attribute.String;
    LabelImage: Attribute.Media<'images' | 'videos' | 'audios' | 'files', true>;
    ItemImage: Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    itemContribution: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'shared.strip': SharedStrip;
      'shared.seo': SharedSeo;
      'shared.meta-social': SharedMetaSocial;
      'shared.email': SharedEmail;
      'shared.discount-percentage': SharedDiscountPercentage;
      'shared.discount-amount': SharedDiscountAmount;
      'shared.day-items': SharedDayItems;
    }
  }
}
