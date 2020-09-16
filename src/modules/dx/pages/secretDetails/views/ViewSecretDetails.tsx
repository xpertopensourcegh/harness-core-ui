import React from 'react'
import { Layout, Text, Color } from '@wings-software/uikit'

import type { SecretDTOV2, SecretTextSpecDTO } from 'services/cd-ng'
import i18n from '../SecretDetails.i18n'

interface ViewSecretDetailsProps {
  secret: SecretDTOV2
}

const ViewSecretDetails: React.FC<ViewSecretDetailsProps> = ({ secret }) => {
  return (
    <Layout.Vertical spacing="large">
      <div>
        <Text>{i18n.labelName}</Text>
        <Text color={Color.BLACK}>{secret.name}</Text>
      </div>
      {(() => {
        if (secret.type === 'SecretText') {
          const secretTextSpec = secret.spec as SecretTextSpecDTO
          switch (secretTextSpec.valueType) {
            case 'Reference':
              return (
                <div>
                  <Text>{i18n.labelPath}</Text>
                  <Text color={Color.GREY_350}>{secretTextSpec.value}</Text>
                </div>
              )
            case 'Inline':
              return (
                <div>
                  <Text>{i18n.labelValue}</Text>
                  <Text color={Color.GREY_350}>{i18n.valueValue}</Text>
                </div>
              )
            default:
              return null
          }
        }
        if (secret.type === 'SecretFile') {
          return (
            <div>
              <Text>{i18n.labelValue}</Text>
              <Text color={Color.GREY_350}>{i18n.valueValueFile}</Text>
            </div>
          )
        }
      })()}
      {secret.type === 'SecretText' || secret.type === 'SecretFile' ? (
        <div>
          <Text>{i18n.labelSecretManager}</Text>
          <Text color={Color.BLACK}>{(secret.spec as SecretTextSpecDTO).secretManagerIdentifier}</Text>
        </div>
      ) : null}
      {secret.description ? (
        <div>
          <Text>{i18n.labelDescription}</Text>
          <Text color={Color.BLACK}>{secret.description}</Text>
        </div>
      ) : null}
      {/* {secret.tags?.length ? (
        <div>
          <Text>{i18n.labelTags}</Text>
          <Layout.Horizontal spacing="small">
            {secret.tags?.map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </Layout.Horizontal>
        </div>
      ) : null} */}
    </Layout.Vertical>
  )
}

export default ViewSecretDetails
