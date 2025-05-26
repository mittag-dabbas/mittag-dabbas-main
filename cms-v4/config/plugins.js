module.exports = ({ env }) => ({
  scheduler: {
    enabled: true,
    config: {
      model: 'scheduler',
    },
  },

  // 
  'import-export-entries': {
    enabled: true,
    config: {
      // See `Config` section.

    },
  },

  // email plugin
  'email-designer': {
    enabled: true,

    // ⬇︎ Add the config property
    config: {
      editor: {
        tools: {
          heading: {
            properties: {
              text: {
                value: 'This is the new default text!',
              },
            },
          },
        },
        options: {
          features: {
            colorPicker: {
              presets: ['#D9E3F0', '#F47373', '#697689', '#37D67A'],
            },
          },
          fonts: {
            showDefaultFonts: false,
            /*
             * If you want use a custom font you need a premium unlayer account and pass a projectId number :-(
             */
            customFonts: [
              {
                label: 'Anton',
                value: "'Anton', sans-serif",
                url: 'https://fonts.googleapis.com/css?family=Anton',
              },
              {
                label: 'Lato',
                value: "'Lato', Tahoma, Verdana, sans-serif",
                url: 'https://fonts.googleapis.com/css?family=Lato',
              },
            ],
          },
          mergeTags: [
            {
              name: 'Email',
              value: '{{ USER.username }}',
              sample: 'john@doe.com',
            },
          ],
        },
        appearance: {
          theme: 'dark',
          panels: {
            tools: {
              dock: 'right',
            },
          },
        },
      },
    },
  },

  'strapi-stripe': {
    enabled: true,
  },

  "strapi-gtm-module": {
    config: {
      gtmId: 'GTM-TDJKQ33Q',
      measurementId: 'G-Y18GWGJZ53',
    },
  },
});
