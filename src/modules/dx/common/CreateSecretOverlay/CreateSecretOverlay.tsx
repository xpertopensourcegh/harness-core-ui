import React from 'react'
import { Layout, Text, Color, Container, Button } from '@wings-software/uikit'
import CreateUpdateSecret, { SecretFormData } from 'modules/dx/components/CreateUpdateSecret/CreateUpdateSecret'
import type { SecretDTOV2 } from 'services/cd-ng'
import i18n from './CreateSecretOverlay.i18n'
import css from './CreateSecretOverlay.module.scss'

interface CreateSecretOverlayProps {
  setShowCreateSecretModal: (val: boolean) => void
  editSecretData?: SecretDTOV2
  type?: SecretDTOV2['type']
  onSuccess?: (data: SecretFormData) => void
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
        secret={editSecretData as SecretDTOV2}
        type={props.type || props.editSecretData?.type || 'SecretText'}
        onSuccess={data => {
          props.setShowCreateSecretModal(false)
          props.onSuccess?.(data)
        }}
      />
    </Container>
  )
}

export default CreateSecretOverlay
