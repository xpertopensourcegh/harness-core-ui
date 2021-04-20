import React from 'react'
import { Button, Layout, ButtonProps } from '@wings-software/uicore'
import { useStrings } from 'framework/exports'
import css from './SubmitAndPreviousButtons.module.scss'

export interface SubmitAndPreviousButtonProps {
  onNextClick?: () => void
  onPreviousClick?: () => void
  nextButtonProps?: ButtonProps
}

export function SubmitAndPreviousButtons(props: SubmitAndPreviousButtonProps): JSX.Element {
  const { onNextClick, onPreviousClick } = props
  const { getString } = useStrings()
  return (
    <Layout.Horizontal className={css.main}>
      <Button
        text={getString('previous')}
        style={{ marginRight: 'var(--spacing-small)' }}
        icon="chevron-left"
        onClick={() => onPreviousClick?.()}
      />
      <Button
        text={getString('next')}
        intent="primary"
        type="submit"
        rightIcon="chevron-right"
        onClick={() => onNextClick?.()}
        {...props.nextButtonProps}
      />
    </Layout.Horizontal>
  )
}
