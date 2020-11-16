import React from 'react'
import { Button, ButtonProps, Layout } from '@wings-software/uikit'
import i18n from './SubmitAndPreviousButtons.i18n'
import css from './SubmitAndPreviousButtons.module.scss'

export interface SubmitAndPreviousButtonProps {
  onNextClick?: () => void
  onPreviousClick?: () => void
}

export function SubmitAndPreviousButtons(props: SubmitAndPreviousButtonProps): JSX.Element {
  const { onNextClick, onPreviousClick } = props
  const submitButtonProps = {
    form: 'onBoardingForm',
    text: i18n.nextLabel,
    intent: 'primary',
    type: 'submit',
    rightIcon: 'chevron-right',
    onClick: () => onNextClick?.()
  } as ButtonProps
  return (
    <Layout.Horizontal className={css.main}>
      <Button
        text={i18n.previousLabel}
        style={{ marginRight: 'var(--spacing-small)' }}
        icon="chevron-left"
        onClick={() => onPreviousClick?.()}
      />
      <Button {...submitButtonProps} />
    </Layout.Horizontal>
  )
}
