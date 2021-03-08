import React, { useCallback, useState } from 'react'
import { useModalHook, StepWizard, Button } from '@wings-software/uicore'
import { Dialog, Classes } from '@blueprintjs/core'
import cx from 'classnames'
import type { NotificationRules } from 'services/pipeline-ng'
import { useStrings } from 'framework/exports'
import Overview from './Steps/Overview'
import PipelineEvents from './Steps/PipelineEvents'
import NotificationMethods from './Steps/NotificationMethods'
import { Actions } from './NotificationUtils'
import { NotificationTypeSelectOptions } from './NotificationTypeOptions'

import css from './useNotificationModal.module.scss'

export interface UseNotificationModalProps {
  onCloseModal?: () => void
  onCreateOrUpdate?: (data?: NotificationRules, index?: number, action?: Actions) => void
}

export interface UseNotificationModalReturn {
  openNotificationModal: (NotificationRules?: NotificationRules, index?: number) => void
  closeNotificationModal: () => void
}

enum Views {
  CREATE,
  EDIT
}

export const useNotificationModal = ({
  onCreateOrUpdate,
  onCloseModal
}: UseNotificationModalProps): UseNotificationModalReturn => {
  const [view, setView] = useState(Views.CREATE)
  const [index, setIndex] = useState<number>()
  const [notificationRules, setNotificationRules] = useState<NotificationRules>()
  const { getString } = useStrings()
  const wizardCompleteHandler = async (wizardData?: NotificationRules): Promise<void> => {
    onCreateOrUpdate?.(wizardData, index, view === Views.CREATE ? Actions.Added : Actions.Update)
  }

  const [showModal, hideModal] = useModalHook(
    () => (
      <Dialog
        isOpen={true}
        onClose={() => {
          setView(Views.CREATE)
          hideModal()
          onCloseModal ? onCloseModal() : null
        }}
        className={cx(Classes.DIALOG, css.dialog)}
      >
        <StepWizard<NotificationRules>
          onCompleteWizard={wizardCompleteHandler}
          icon="notifications"
          title={getString('newNotification')}
        >
          <Overview name={getString('pipeline-notifications.nameOftheRule')} data={notificationRules} />
          <PipelineEvents name={getString('pipeline-notifications.pipelineEvents')} />
          <NotificationMethods
            name={getString('pipeline-notifications.notificationMethod')}
            typeOptions={NotificationTypeSelectOptions}
          />
        </StepWizard>
        <Button
          minimal
          icon="cross"
          className={css.crossIcon}
          iconProps={{ size: 18 }}
          onClick={() => {
            setView(Views.CREATE)
            hideModal()
            onCloseModal ? onCloseModal() : null
          }}
        />
      </Dialog>
    ),
    [view, notificationRules, wizardCompleteHandler]
  )

  const open = useCallback(
    (_notification?: NotificationRules, _index?: number) => {
      setNotificationRules(_notification)
      if (_notification) {
        setIndex(_index)
        setView(Views.EDIT)
      } else setView(Views.CREATE)
      showModal()
    },
    [showModal]
  )

  return {
    openNotificationModal: (_notificationRules?: NotificationRules, _index?: number) =>
      open(_notificationRules, _index),
    closeNotificationModal: hideModal
  }
}
