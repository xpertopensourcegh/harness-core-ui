import React, { useState } from 'react'
import { useParams } from 'react-router'
import { omit } from 'lodash-es'
import { stringify, parse } from 'yaml'
import {
  useModalHook,
  Button,
  Layout,
  Icon,
  Text,
  ModalErrorHandlerBinding,
  ModalErrorHandler
} from '@wings-software/uicore'
import { Dialog, IDialogProps } from '@blueprintjs/core'
import { useStrings } from 'framework/strings'
import { GitDiff } from '@common/components/GitDiff/GitDiff'
import type { SaveToGitFormInterface } from '@common/components/SaveToGitForm/SaveToGitForm'
import { ResponseGitFileContent, useGetFileContent } from 'services/cd-ng'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'

import css from './useGitDiffDialog.module.scss'

export interface UseGitDiffDialogProps<T> {
  onSuccess: (data: T) => void
  onClose: () => void
}

export interface UseGitDiffDialogReturn<T> {
  openGitDiffDialog: (entity?: T, gitDetails?: SaveToGitFormInterface, _modalProps?: IDialogProps) => void
  hideGitDiffDialog: () => void
}

export function useGitDiffDialog<T>(props: UseGitDiffDialogProps<T>): UseGitDiffDialogReturn<T> {
  const { onSuccess, onClose } = props
  const { getString } = useStrings()
  const [modalErrorHandler, setModalErrorHandler] = React.useState<ModalErrorHandlerBinding>()
  const [entity, setEntity] = useState<T>()
  const [entityAsYaml, setEntityAsYaml] = useState<string>()
  const [showGitDiff, setShowGitDiff] = useState<boolean>(false)
  const defaultModalProps: IDialogProps = {
    isOpen: true,
    style: {
      minWidth: 500,
      minHeight: 200,
      borderLeft: 0,
      paddingBottom: 0,
      position: 'relative',
      overflow: 'hidden'
    }
  }
  const [modalProps, setModalProps] = useState<IDialogProps>(defaultModalProps)
  const { accountId, projectIdentifier, orgIdentifier } = useParams<ProjectPathProps>()
  const commonParams = {
    accountIdentifier: accountId,
    projectIdentifier,
    orgIdentifier
  }
  const { response: remoteVersion, refetch: fetchRemoteFileContent, error } = useGetFileContent({
    queryParams: {
      ...commonParams,
      yamlGitConfigIdentifier: '',
      filePath: '',
      branch: ''
    },
    lazy: true
  })

  React.useEffect(() => {
    if (showGitDiff) {
      const { isOpen, style } = defaultModalProps
      const expandedModalProps = {
        isOpen,
        style: Object.assign(omit(style, 'minHeight'), { width: 'calc(100vw - 100px)', height: 'calc(100vh - 100px)' })
      }
      setModalProps(expandedModalProps)
      if (error?.message) {
        modalErrorHandler?.showDanger(error.message || '')
      }
    }
  }, [showGitDiff, error?.message])

  React.useEffect(() => {
    try {
      setEntityAsYaml(stringify(entity))
    } catch (e) {
      //ignore error
    }
  }, [entity])

  const [showModal, hideModal] = useModalHook(() => {
    const closeHandler = (): void => {
      onClose()
      hideModal()
      setShowGitDiff(false)
      setModalProps(defaultModalProps)
    }
    return (
      <Dialog {...modalProps}>
        <ModalErrorHandler bind={setModalErrorHandler} />
        <Button minimal icon="cross" iconProps={{ size: 18 }} className={css.crossIcon} onClick={closeHandler} />
        {showGitDiff ? (
          <GitDiff
            remoteVersion={(remoteVersion as ResponseGitFileContent['data'])?.content || ''}
            localVersion={entityAsYaml || ''}
            onSave={data => {
              try {
                onSuccess(parse(data) as T)
                hideModal()
              } catch (e) {
                //ignore e
              }
            }}
            onCancel={closeHandler}
            width={'calc(100vw - 100px)'}
            height={error ? 'calc(100vh - 265px)' : 'calc(100vh - 210px)'}
          />
        ) : (
          <Layout.Horizontal padding={{ top: 'xlarge', left: 'xxlarge' }} spacing="large">
            <Layout.Vertical>
              <Icon name="cross" size={25} className={css.error} padding="medium" />
            </Layout.Vertical>
            <Layout.Vertical padding={{ left: 'medium' }}>
              <Text style={{ fontWeight: 'bold' }} padding={{ bottom: 'medium' }}>
                {getString('common.newVersion')}
              </Text>
              <Text>{getString('common.confictOccured', { name: 'Someone' })}</Text>
              <Text padding={{ bottom: 'large' }}>{getString('common.resolveConflict')}</Text>
              <Button
                intent="primary"
                text={getString('common.seeWhatChanged')}
                onClick={() => setShowGitDiff(true)}
                width="fit-content"
                padding={{ left: 'small' }}
              />
            </Layout.Vertical>
          </Layout.Horizontal>
        )}
      </Dialog>
    )
  }, [showGitDiff, modalProps])
  return {
    openGitDiffDialog: (_entity?: T, gitDetails?: SaveToGitFormInterface, _modalProps?: IDialogProps) => {
      setEntity(_entity)
      const { repoIdentifier = '', filePath = '', rootFolder = '', branch = '' } = gitDetails || {}
      fetchRemoteFileContent({
        queryParams: {
          ...commonParams,
          yamlGitConfigIdentifier: repoIdentifier,
          filePath: rootFolder?.concat(filePath) || '',
          branch
        }
      })
      setModalProps(_modalProps || modalProps)
      showModal()
    },
    hideGitDiffDialog: () => {
      hideModal()
      setShowGitDiff(false)
      setModalProps(defaultModalProps)
    }
  }
}
