import React from 'react'
import { Layout, Text, Color } from '@wings-software/uikit'

import i18n from '../SecretDetails.i18n'
import type { EncryptedDataDTO } from 'services/cd-ng'

interface ViewSecretDetailsProps {
  secret: EncryptedDataDTO
}

const ViewSecretDetails: React.FC<ViewSecretDetailsProps> = ({ secret }) => {
  return (
    <Layout.Vertical spacing="medium">
      <div>
        <Text>{i18n.labelName}</Text>
        <Text color={Color.BLACK}>{secret.name}</Text>
      </div>
      <div>
        <Text>{i18n.labelId}</Text>
        <Text color={Color.BLACK}>{secret.uuid}</Text>
      </div>
      <div>
        <Text>{i18n.labelValue}</Text>
        <Text color={Color.BLACK}>{i18n.valueValue}</Text>
      </div>
      <div>
        <Text>{i18n.labelSecretManager}</Text>
        <Text color={Color.BLACK}>{secret.encryptedBy}</Text>
      </div>
      {secret.lastUpdatedAt ? (
        <div>
          <Text>{i18n.labelLastUpdate}</Text>
          <Text color={Color.BLACK}>{new Date(secret.lastUpdatedAt).toLocaleDateString()}</Text>
        </div>
      ) : null}
    </Layout.Vertical>
  )
}

export default ViewSecretDetails
