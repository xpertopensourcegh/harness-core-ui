import React from 'react'
import { Layout, Text, Color } from '@wings-software/uikit'

import type {
  KerberosConfigDTO,
  SecretResponseWrapper,
  SecretTextSpecDTO,
  SSHConfigDTO,
  SSHKeyPathCredentialDTO,
  SSHKeyReferenceCredentialDTO,
  SSHKeySpecDTO,
  SSHPasswordCredentialDTO,
  TGTKeyTabFilePathSpecDTO,
  ConnectorConnectivityDetails
} from 'services/cd-ng'
import { getStringForCredentialType, getStringForType } from 'modules/dx/components/secrets/SSHAuthUtils'

import sshi18n from 'modules/dx/components/secrets/SSHAuthFormFields/SSHAuthFormFields.i18n'
import VerifyConnection from 'modules/dx/modals/CreateSSHCredModal/views/VerifyConnection'
import i18n from '../SecretDetails.i18n'
import ConnectorStats from '../../connectors/ConnectorStats'
import css from './EditSSHSecret.module.scss'

interface ViewSecretDetailsProps {
  secret: SecretResponseWrapper
}

const ViewSecretDetails: React.FC<ViewSecretDetailsProps> = props => {
  const {
    secret: { secret }
  } = props
  return (
    <Layout.Horizontal>
      <Layout.Vertical width="50%" spacing="large">
        <div>
          <Text>{i18n.labelName}</Text>
          <Text color={Color.BLACK}>{secret.name}</Text>
        </div>
        <div>
          <Text>{i18n.labelType}</Text>
          <Text color={Color.BLACK}>{getStringForType(secret.type)}</Text>
        </div>
        {secret.type === 'SSHKey' ? (
          <>
            <div>
              <Text>{sshi18n.labelAuth}</Text>
              <Text color={Color.BLACK}>{(secret.spec as SSHKeySpecDTO)?.authScheme}</Text>
            </div>
            {(secret.spec as SSHKeySpecDTO)?.authScheme === 'SSH' ? (
              <>
                <div>
                  <Text>{sshi18n.labelCredentialType}</Text>
                  <Text color={Color.BLACK}>
                    {getStringForCredentialType((secret.spec as SSHKeySpecDTO)?.spec.credentialType)}
                  </Text>
                </div>
                <div>
                  <Text>{sshi18n.labelUsername}</Text>
                  <Text color={Color.BLACK}>
                    {(((secret.spec as SSHKeySpecDTO)?.spec as SSHConfigDTO).spec as SSHPasswordCredentialDTO).userName}
                  </Text>
                </div>
                {((secret.spec as SSHKeySpecDTO)?.spec as SSHConfigDTO).credentialType === 'Password' ? (
                  <>
                    <div>
                      <Text>{sshi18n.labelPassword}</Text>
                      <Text color={Color.GREY_350}>{i18n.valueValue}</Text>
                    </div>
                  </>
                ) : null}
                {((secret.spec as SSHKeySpecDTO)?.spec as SSHConfigDTO).credentialType === 'KeyPath' ? (
                  <>
                    <div>
                      <Text>{sshi18n.labelKeyFilePath}</Text>
                      <Text color={Color.BLACK}>
                        {
                          (((secret.spec as SSHKeySpecDTO)?.spec as SSHConfigDTO).spec as SSHKeyPathCredentialDTO)
                            .keyPath
                        }
                      </Text>
                    </div>
                    <div>
                      <Text>{sshi18n.labelPassphrase}</Text>
                      <Text color={Color.GREY_350}>{i18n.valueValue}</Text>
                    </div>
                  </>
                ) : null}
                {((secret.spec as SSHKeySpecDTO)?.spec as SSHConfigDTO).credentialType === 'KeyReference' ? (
                  <>
                    <div>
                      <Text>{sshi18n.labelKeyReference}</Text>
                      <Text color={Color.BLACK}>
                        {
                          (((secret.spec as SSHKeySpecDTO)?.spec as SSHConfigDTO).spec as SSHKeyReferenceCredentialDTO)
                            .key
                        }
                      </Text>
                    </div>
                    <div>
                      <Text>{sshi18n.labelPassphrase}</Text>
                      <Text color={Color.GREY_350}>{i18n.valueValue}</Text>
                    </div>
                  </>
                ) : null}
              </>
            ) : null}
            {(secret.spec as SSHKeySpecDTO)?.authScheme === 'Kerberos' ? (
              <>
                <div>
                  <Text>{sshi18n.labelPrincipal}</Text>
                  <Text color={Color.BLACK}>
                    {((secret.spec as SSHKeySpecDTO)?.spec as KerberosConfigDTO).principal}
                  </Text>
                </div>
                <div>
                  <Text>{sshi18n.labelRealm}</Text>
                  <Text color={Color.BLACK}>{((secret.spec as SSHKeySpecDTO)?.spec as KerberosConfigDTO).realm}</Text>
                </div>
                <div>
                  <Text>{sshi18n.labelTGT}</Text>
                  <Text color={Color.BLACK}>
                    {((secret.spec as SSHKeySpecDTO)?.spec as KerberosConfigDTO).tgtGenerationMethod}
                  </Text>
                </div>
                {((secret.spec as SSHKeySpecDTO)?.spec as KerberosConfigDTO).tgtGenerationMethod ===
                'KeyTabFilePath' ? (
                  <>
                    <div>
                      <Text>{sshi18n.labelKeyTab}</Text>
                      <Text color={Color.BLACK}>
                        {
                          (((secret.spec as SSHKeySpecDTO)?.spec as KerberosConfigDTO)
                            ?.spec as TGTKeyTabFilePathSpecDTO)?.keyPath
                        }
                      </Text>
                    </div>
                  </>
                ) : null}
                {((secret.spec as SSHKeySpecDTO)?.spec as KerberosConfigDTO).tgtGenerationMethod === 'Password' ? (
                  <>
                    <div>
                      <Text>{sshi18n.labelPassword}</Text>
                      <Text color={Color.GREY_350}>{i18n.valueValue}</Text>
                    </div>
                  </>
                ) : null}
              </>
            ) : null}
          </>
        ) : null}
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
      {secret.type === 'SSHKey' ? (
        <Layout.Vertical width="50%" spacing="xxxlarge" border={{ left: true }} padding={{ left: 'xxxlarge' }}>
          <ConnectorStats
            createdAt={props.secret.createdAt as number}
            lastUpdated={props.secret.updatedAt}
            status={'' as ConnectorConnectivityDetails['status']}
            className={css.stats}
          />
          <VerifyConnection identifier={secret.identifier} />
        </Layout.Vertical>
      ) : null}
    </Layout.Horizontal>
  )
}

export default ViewSecretDetails
