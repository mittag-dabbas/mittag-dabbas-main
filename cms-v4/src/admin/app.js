import PreviewButton from "./extensions/components/PreviewButton";
import TweetButton from "./extensions/components/TweetButton";
import RelativeTime from "./extensions/components/RelativeTime"; // Import your RelativeTime component

export default {
  config: {
    locales: ["fr"],
    translations: {
      fr: {
        "components.PreviewButton.button": "Prévisualiser",
        "components.TweetButton.button": "Partager sur Twitter",
      },
      en: {
        "components.PreviewButton.button": "Preview",
        "components.TweetButton.button": "Share on Twitter",
      },
    },
  },
  bootstrap(app) {
    app.injectContentManagerComponent("editView", "right-links", {
      name: "PreviewButton",
      Component: PreviewButton,
    });
    app.injectContentManagerComponent("editView", "right-links", {
      name: "TweetButton",
      Component: TweetButton,
    });
    // Register the RelativeTime custom field
    app.addFields({
      type: "relativeTime", // Define the custom type
      Component: RelativeTime, // Attach your custom RelativeTime component
    });
  },
};
