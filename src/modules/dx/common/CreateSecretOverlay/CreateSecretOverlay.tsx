import React from 'react'
import { Layout, Text, Color, Container, Button } from '@wings-software/uikit'
import CreateUpdateSecret, { SecretFormData } from 'modules/dx/components/CreateUpdateSecret/CreateUpdateSecret'
import type { SecretDTOV2, ResponsePageConnectorResponse } from 'services/cd-ng'
import type { UseGetMockData } from 'modules/common/utils/testUtils'
import i18n from './CreateSecretOverlay.i18n'
import css from './CreateSecretOverlay.module.scss'

interface CreateSecretOverlayProps {
  setShowCreateSecretModal: (val: boolean) => void
  editSecretData?: SecretDTOV2
  type?: SecretDTOV2['type']
  onSuccess?: (data: SecretFormData) => void
  connectorListMockData?: UseGetMockData<ResponsePageConnectorResponse>
}

const CreateSecretOverlay: React.FC<CreateSecretOverlayProps> = props => {
  const { setShowCreateSecretModal, editSecretData } = props
  return (
    <Container className={css.stepsOverlay} width={'400px'} padding="large">
      <Layout.Horizontal flex={{ distribution: 'space-between' }} padding={{ top: 'small', bottom: 'large' }}>
        <Text color={Color.GREY_800} font={{ size: 'medium' }}>
          {editSecretData ? i18n.MODIFY_SECRET : i18n.CREATE_SECRET}
        </Text>
        <Button
          minimal
          icon="cross"
          onClick={() => {
            setShowCreateSecretModal(false)
          }}
        />
      </Layout.Horizontal>
      <CreateUpdateSecret
        secret={editSecretData ? { secret: editSecretData } : undefined}
        type={props.type || props.editSecretData?.type || 'SecretText'}
        onSuccess={data => {
          props.setShowCreateSecretModal(false)
          props.onSuccess?.(data)
        }}
        connectorListMockData={props.connectorListMockData}
      />
    </Container>
  )
}

export default CreateSecretOverlay
