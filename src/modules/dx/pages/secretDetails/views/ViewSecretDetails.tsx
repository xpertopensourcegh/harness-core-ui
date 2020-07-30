import React from 'react'
import { Layout, Text, Color, Tag } from '@wings-software/uikit'

import type { EncryptedDataDTO } from 'services/cd-ng'
import i18n from '../SecretDetails.i18n'

interface ViewSecretDetailsProps {
  secret: EncryptedDataDTO
}

const ViewSecretDetails: React.FC<ViewSecretDetailsProps> = ({ secret }) => {
  return (
    <Layout.Vertical spacing="large">
      <div>
        <Text>{i18n.labelName}</Text>
        <Text color={Color.BLACK}>{secret.name}</Text>
      </div>
      {secret.path ? (
        <div>
          <Text>{i18n.labelPath}</Text>
          <Text color={Color.GREY_350}>{secret.path}</Text>
        </div>
      ) : (
        <div>
          <Text>{i18n.labelValue}</Text>
          <Text color={Color.GREY_350}>{i18n.valueValue}</Text>
        </div>
      )}
      <div>
        <Text>{i18n.labelSecretManager}</Text>
        <Text color={Color.BLACK}>{secret.secretManagerName || secret.secretManagerIdentifier}</Text>
      </div>
      {secret.description ? (
        <div>
          <Text>{i18n.labelDescription}</Text>
          <Text color={Color.BLACK}>{secret.description}</Text>
        </div>
      ) : null}
      {secret.tags?.length ? (
        <div>
          <Text>{i18n.labelTags}</Text>
          <Layout.Horizontal>
            {secret.tags?.map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </Layout.Horizontal>
        </div>
      ) : null}
    </Layout.Vertical>
  )
}

export default ViewSecretDetails
