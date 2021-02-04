import React from 'react'
import { useModalHook, Button, Text, Card, Icon, IconName, Layout } from '@wings-software/uicore'
import { Dialog, IDialogProps } from '@blueprintjs/core'
import type { ConnectorInfoDTO } from 'services/cd-ng'
import useCreateConnectorModal, { UseCreateConnectorModalProps } from './useCreateConnectorModal'
import css from '../../components/CreateConnectorWizard/CreateConnectorWizard.module.scss'

export interface UseCreateConnectorMultiTypeModalProps {
  types: ConnectorInfoDTO['type'][]
  onSuccess?: UseCreateConnectorModalProps['onSuccess']
  onClose?: () => void
}

export interface UseCreateConnectorMultiTypeModalReturn {
  openConnectorMultiTypeModal: () => void
  hideConnectorMultiTypeModal: () => void
}

const modalProps: IDialogProps = {
  isOpen: true,
  style: {
    width: 1175,
    minHeight: 640,
    borderLeft: 0,
    paddingBottom: 0,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#0278D5',
    padding: '300px 140px 0'
  }
}

const connectorsMap = {
  Gcp: { label: 'GCP', icon: 'service-gcp' },
  Aws: { label: 'AWS', icon: 'service-aws' },
  K8sCluster: { label: 'Kubernetes cluster', icon: 'service-kubernetes' },
  Vault: { label: 'HashiCorp Vault', icon: 'hashiCorpVault' },
  Nexus: { label: 'Nexus', icon: 'service-nexus' },
  DockerRegistry: { label: 'Docker', icon: 'service-dockerhub' },
  Artifactory: { label: 'Artifactory', icon: 'service-artifactory' },
  Bitbucket: { label: 'Bitbucket', icon: 'bitbucket' },
  Github: { label: 'GitHub', icon: 'github' },
  Git: { label: 'Git', icon: 'service-github' },
  Gitlab: { label: 'GitLab', icon: 'service-gotlab' },
  Splunk: { label: 'Splunk server', icon: 'service-splunk' },
  AppDynamics: { label: 'AppDynamics server', icon: 'service-appdynamics' },
  Jira: { label: 'Jira', icon: 'cog' },
  YAML: { label: 'YAML', icon: 'cog' }
}

const useCreateConnectorMultiTypeModal = (
  props: UseCreateConnectorMultiTypeModalProps
): UseCreateConnectorMultiTypeModalReturn => {
  const { openConnectorModal } = useCreateConnectorModal({
    onSuccess: props.onSuccess
  })

  const handleSelect = (type: ConnectorInfoDTO['type']): void => {
    hideModal()
    openConnectorModal(false, type, undefined)
  }

  const handleClose = (): void => {
    props.onClose?.()
    hideModal()
  }

  const [showModal, hideModal] = useModalHook(
    () => (
      <Dialog {...modalProps}>
        <Text font={{ size: 'large', weight: 'semi-bold' }} color="white" margin={{ bottom: 'small' }}>
          Select your Connector type
        </Text>
        <Text font={{ size: 'normal', weight: 'semi-bold' }} color="white" margin={{ bottom: 'xxlarge' }}>
          Start by selecting your connector type
        </Text>
        <Layout.Horizontal spacing="medium">
          {props.types.map(type => (
            <div key={type}>
              <Card interactive={true} elevation={0} selected={false} onClick={() => handleSelect(type)}>
                <Icon name={(connectorsMap as any)?.[type]?.icon as IconName} size={20} />
              </Card>
              <Text color="white" margin={{ top: 'small' }} style={{ textAlign: 'center' }}>
                {(connectorsMap as any)?.[type]?.label}
              </Text>
            </div>
          ))}
        </Layout.Horizontal>
        <Button className={css.crossIcon} minimal icon="cross" iconProps={{ size: 18 }} onClick={handleClose} />
      </Dialog>
    ),
    [props.types]
  )

  return {
    openConnectorMultiTypeModal: showModal,
    hideConnectorMultiTypeModal: hideModal
  }
}

export default useCreateConnectorMultiTypeModal
