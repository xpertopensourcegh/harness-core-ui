import React from 'react'
import cx from 'classnames'
import { useModalHook } from '@wings-software/uicore'
import { Dialog, Classes } from '@blueprintjs/core'
import { useParams } from 'react-router-dom'
import { useToaster } from '@common/components'
import { useStrings } from 'framework/strings'
import { Versions } from '@common/constants/Utils'
import type { AccountPathProps } from '@common/interfaces/RouteInterfaces'
import { useUpdateAccountDefaultExperienceNG } from 'services/cd-ng'
import DefaultVersionForm from './views/DefaultVersionForm'
import css from './DefaultVersion.module.scss'

interface Props {
  refetchAcct: () => void
  defaultVersion?: Versions
}

interface ModalReturn {
  openDefaultVersionModal: (_currentVersion: Versions) => void
  closeDefaultVersionModal: () => void
}

export const useDefaultVersionModal = ({ defaultVersion, refetchAcct }: Props): ModalReturn => {
  const [currentVersion, setCurrentVersion] = React.useState<Versions>(defaultVersion || Versions.NG)
  const { accountId } = useParams<AccountPathProps>()
  const { mutate: updateDefaultExperience, loading } = useUpdateAccountDefaultExperienceNG({
    accountIdentifier: accountId
  })
  const { getString } = useStrings()
  const { showError } = useToaster()

  const handleSubmit = async (): Promise<void> => {
    try {
      await updateDefaultExperience({
        defaultExperience: currentVersion
      })
      refetchAcct()
    } catch (error) {
      showError(error.data?.message || getString('somethingWentWrong'))
    }
    hideModal()
  }

  const [showModal, hideModal] = useModalHook(
    () => (
      <Dialog isOpen title="" onClose={hideModal} className={cx(css.dialog, Classes.DIALOG)}>
        <DefaultVersionForm
          onSubmit={handleSubmit}
          loading={loading}
          currentVersion={currentVersion}
          setCurrentVersion={setCurrentVersion}
        />
      </Dialog>
    ),
    [currentVersion, loading]
  )

  const open = React.useCallback(
    (_currentVersion: Versions) => {
      setCurrentVersion(_currentVersion)
      showModal()
    },
    [showModal]
  )

  return {
    openDefaultVersionModal: open,
    closeDefaultVersionModal: hideModal
  }
}
