import React from 'react'
import { useModalHook, Container, Layout, Button } from '@wings-software/uicore'
import { Dialog, Classes } from '@blueprintjs/core'
import cx from 'classnames'
import { FeedBackForm, ExtendTrialForm } from './ExtendTrialOrFeedbackForm'
import css from './useExtendTrialOrFeedbackModal.module.scss'

export interface FeedbackFormValues {
  experience?: string
  suggestion?: string
}

export const enum FORM_TYPE {
  EXTEND_TRIAL = 'EXTEND_TRIAL',
  FEEDBACK = 'FEEDBACK'
}

interface UseExtendTrialOrFeedbackModalProps {
  onCloseModal?: () => void
  onSubmit: (values: FeedbackFormValues) => void
  moduleDescription: string
  bgImg: string
  expiryDateStr: string
  formType: FORM_TYPE
}

interface UseExtendTrialOrFeedbackModalReturn {
  openExtendTrialOrFeedbackModal: () => void
  closeExtendTrialOrFeedbackModal: () => void
}

const ExtendTrialOrFeedbackDialog: React.FC<UseExtendTrialOrFeedbackModalProps> = ({
  bgImg,
  expiryDateStr,
  onCloseModal,
  onSubmit,
  moduleDescription,
  formType
}) => {
  return (
    <Layout.Horizontal>
      <Container
        width="45%"
        className={css.left}
        style={{
          background: `transparent url(${bgImg}) no-repeat`
        }}
      />
      <Container className={css.right} width="55%">
        {formType === FORM_TYPE.EXTEND_TRIAL ? (
          <ExtendTrialForm
            expiryDateStr={expiryDateStr}
            moduleDescription={moduleDescription}
            onCloseModal={() => {
              onCloseModal?.()
            }}
            onSubmit={onSubmit}
          />
        ) : (
          <FeedBackForm
            moduleDescription={moduleDescription}
            onCloseModal={() => {
              onCloseModal?.()
            }}
            onSubmit={onSubmit}
          />
        )}
      </Container>
    </Layout.Horizontal>
  )
}

export const useExtendTrialOrFeedbackModal = (
  props: UseExtendTrialOrFeedbackModalProps
): UseExtendTrialOrFeedbackModalReturn => {
  const onCloseModal = (): void => {
    props.onCloseModal?.(), hideModal()
  }
  const [showModal, hideModal] = useModalHook(
    () => (
      <Dialog isOpen={true} onClose={onCloseModal} className={cx(css.dialog, Classes.DIALOG, css.feedback)}>
        <ExtendTrialOrFeedbackDialog {...props} onCloseModal={onCloseModal} />
        <Button
          aria-label="close modal"
          minimal
          icon="cross"
          iconProps={{ size: 18 }}
          onClick={onCloseModal}
          className={css.crossIcon}
        />
      </Dialog>
    ),
    []
  )

  return {
    openExtendTrialOrFeedbackModal: showModal,
    closeExtendTrialOrFeedbackModal: hideModal
  }
}
