import React from 'react';
import { Button } from '@strapi/design-system/Button';
import Eye from '@strapi/icons/Eye';
import { useCMEditViewDataManager } from '@strapi/helper-plugin';
import { useIntl } from 'react-intl';

const PreviewButton = () => {
  const { formatMessage } = useIntl();
  const { modifiedData, layout } = useCMEditViewDataManager();

  const bannedApiID = ['category'];
  const stripeEnabled = layout.apiID === 'ss-product';

  if (bannedApiID.includes(layout.apiID)) {
    return null;
  }

  const clientUrl = window.strapi?.backendURL || 'http://localhost:1337';
  // const previewSecret = process.env.STRAPI_ADMIN_CLIENT_PREVIEW_SECRET;
  const previewSecret = 'Test123';
  if (!clientUrl || !previewSecret) {
    return null;
  }

  const handlePreview = () => {
    const previewUrl = `${clientUrl}/api/preview?secret=${previewSecret}&slug=${modifiedData.slug}&locale=${modifiedData.locale}&apiID=${layout.apiID}&kind=${layout.kind}`;
    window.open(previewUrl, '_blank').focus();
  };

  const content = {
    id: 'components.PreviewButton.button',
    defaultMessage: 'Preview',
  };

  return (
    <>
      <Button variant="secondary" startIcon={<Eye />} onClick={handlePreview}>
        {formatMessage(content)}
      </Button>
    </>
  );
};

export default PreviewButton;
