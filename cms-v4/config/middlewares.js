module.exports = [
  "strapi::errors",
  {
    name: "strapi::cors",
    config: {
      enabled: true,
      headers: "*",
      origin: [
        "http://localhost:3000",
        "https://localhost:3000",
        "https://mittag-dabbas.com",
        "https://www.mittag-dabbas.com",
        "https://www.competent-excitement-ce7f862fc3.strapiapp.com",
        "https://competent-excitement-ce7f862fc3.strapiapp.com",
        "competent-excitement-ce7f862fc3.strapiapp.com"
      ],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
      credentials: true,
    },
  },
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  "strapi::favicon",
  "strapi::public",
  "strapi::session",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        directives: {
          "script-src": ["'self'", "editor.unlayer.com"],
          "frame-src": ["'self'", "editor.unlayer.com"],
          "img-src": [
            "'self'",
            "data:",
            "cdn.jsdelivr.net",
            "strapi.io",
            "s3.amazonaws.com",
            "editor.unlayer.com",
            "localhost:1337",
            "blob:",
            "*", // Add this line to allow all sources
            "admin.mittag-dabbas.com",
            "https://competent-excitement-ce7f862fc3.strapiapp.com",
            "https://www.competent-excitement-ce7f862fc3.strapiapp.com",
            "competent-excitement-ce7f862fc3.strapiapp.com"
          ],
        },
      },
    },
  },
];
