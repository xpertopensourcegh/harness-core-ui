import React from 'react'
import { useParams } from 'react-router-dom'
import type { ResponseSecretResponseWrapper } from 'services/cd-ng'
import { useStrings } from 'framework/strings'
import { useDocumentTitle } from '@common/hooks/useDocumentTitle'
import type { SecretsPathProps } from '@common/interfaces/RouteInterfaces'
import EntitySetupUsage from '@common/pages/entityUsage/EntityUsage'

interface ReferencedByProps {
  secretData?: ResponseSecretResponseWrapper
}
const SecretReferences: React.FC<ReferencedByProps> = props => {
  const { secretId } = useParams<SecretsPathProps>()
  const { getString } = useStrings()

  useDocumentTitle([
    getString('common.references'),
    props.secretData?.data?.secret.name || '',
    getString('common.secrets')
  ])

  return (
    <>
      <EntitySetupUsage entityType={'Secrets'} entityIdentifier={secretId} />
    </>
  )
}

export default SecretReferences
