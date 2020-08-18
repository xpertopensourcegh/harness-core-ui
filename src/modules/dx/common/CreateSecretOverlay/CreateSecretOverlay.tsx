import React from 'react'
import { Layout, Icon, Text, Color } from '@wings-software/uikit'
import CreateUpdateSecret from 'modules/dx/components/CreateUpdateSecret/CreateUpdateSecret'
import type { EncryptedDataDTO } from 'services/cd-ng'
import css from './CreateSecretOverlay.module.scss'

interface CreateSecretOverlayProps {
  setShowCreateSecretModal: (val: boolean) => void
  editSecretData?: EncryptedDataDTO
}

const CreateSecretOverlay: React.FC<CreateSecretOverlayProps> = props => {
  return (
    <Layout.Vertical className={css.stepsOverlay} width={'400px'} padding="large">
      <Layout.Horizontal flex={{ distribution: 'space-between' }} padding={{ top: 'small', bottom: 'large' }}>
        <Text color={Color.GREY_800} font={{ size: 'medium' }}>
          {props.editSecretData ? ' Modify' : 'Create'} Secret
        </Text>
        <Icon
          name="cross"
          onClick={() => {
            props.setShowCreateSecretModal(false)
          }}
          className={css.crossIcon}
        />
      </Layout.Horizontal>
      <CreateUpdateSecret
        secret={props.editSecretData}
        type="SecretText"
        onSuccess={() => {
          props.setShowCreateSecretModal(false)
        }}
      />
    </Layout.Vertical>
  )
}

export default CreateSecretOverlay
