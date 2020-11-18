import React from 'react'
import { useParams } from 'react-router-dom'
import { Tabs, Tab } from '@blueprintjs/core'
import { pick } from 'lodash-es'
import { Text } from '@wings-software/uikit'

import { getScopeFromDTO } from '@common/components/EntityReference/EntityReference'
import SecretReference from '@secrets/components/SecretReference/SecretReference'
import { getReference } from '@secrets/utils/SSHAuthUtils'
import CreateUpdateSecret from '@secrets/components/CreateUpdateSecret/CreateUpdateSecret'
import type { UseGetMockData } from '@common/utils/testUtils'
import type {
  ResponsePageConnectorResponse,
  SecretResponseWrapper,
  ResponsePageSecretResponseWrapper
} from 'services/cd-ng'

import i18n from './CreateOrSelectSecret.i18n'

export interface SecretReference {
  name: string
  identifier: string
  orgIdentifier?: string
  projectIdentifier?: string
  referenceString: string
}

interface CreateOrSelectSecretProps {
  type?: SecretResponseWrapper['secret']['type']
  onSuccess: (secret: SecretReference) => void
  connectorsListMockData?: UseGetMockData<ResponsePageConnectorResponse>
  secretsListMockData?: ResponsePageSecretResponseWrapper
}

const CreateOrSelectSecret: React.FC<CreateOrSelectSecretProps> = ({
  type,
  onSuccess,
  connectorsListMockData,
  secretsListMockData
}) => {
  const { accountId, orgIdentifier, projectIdentifier } = useParams()
  return (
    <>
      <Tabs id={'CreateOrSelect'}>
        <Tab
          id={'create'}
          title={<Text padding={'medium'}>{i18n.titleCreate}</Text>}
          panel={
            <CreateUpdateSecret
              type={type}
              onSuccess={data => {
                onSuccess({
                  ...pick(data, ['name', 'identifier', 'orgIdentifier', 'projectIdentifier']),
                  referenceString: getReference(getScopeFromDTO(data), data.identifier) as string
                })
              }}
              connectorListMockData={connectorsListMockData}
            />
          }
        />
        <Tab
          id={'reference'}
          title={<Text padding={'medium'}>{i18n.titleSelect}</Text>}
          panel={
            <SecretReference
              type={type}
              onSelect={data => {
                onSuccess({
                  ...pick(data, ['name', 'identifier', 'orgIdentifier', 'projectIdentifier']),
                  referenceString: getReference(data.scope, data.identifier) as string
                })
              }}
              accountIdentifier={accountId}
              orgIdentifier={orgIdentifier}
              projectIdentifier={projectIdentifier}
              mock={secretsListMockData}
            />
          }
        />
      </Tabs>
    </>
  )
}

export default CreateOrSelectSecret
