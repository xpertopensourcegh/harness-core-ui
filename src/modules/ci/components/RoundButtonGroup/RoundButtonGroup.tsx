import React, { useMemo, useState } from 'react'
import { Container, Intent, Button, ButtonProps } from '@wings-software/uikit'
import classNames from 'classnames'
import css from './RoundButtonGroup.module.scss'

export interface RoundButtonGroupProps {
  className?: string
}

export const RoundButtonGroup: React.FC<RoundButtonGroupProps> = ({ className, children }) => {
  return <Container className={classNames(css.btnGroup, className)}>{children}</Container>
}

export interface OptionButtonProps extends ButtonProps {
  value: string | number
  selected?: boolean
}

export interface OptionsRoundButtonGroupProps {
  intent?: Intent
  onChange?: (value: string | number) => void
  options: OptionButtonProps[]
}

export const OptionsRoundButtonGroup: React.FC<OptionsRoundButtonGroupProps> = ({ intent, options, onChange }) => {
  const [index, setIndex] = useState(-1)
  const buttons = useMemo(
    () =>
      options.map((props, _index) => {
        if (props.selected && index === -1) {
          setIndex(_index)
        }
        const _intent = index === _index ? { intent: intent || Intent.PRIMARY } : null
        return (
          <Button
            key={props.value}
            {...props}
            {..._intent}
            onClick={() => {
              if (_index !== index) {
                setIndex(_index)
                if (onChange) onChange(props.value)
              }
            }}
          />
        )
      }),
    [index, intent, options, onChange]
  )

  return <RoundButtonGroup>{buttons}</RoundButtonGroup>
}
