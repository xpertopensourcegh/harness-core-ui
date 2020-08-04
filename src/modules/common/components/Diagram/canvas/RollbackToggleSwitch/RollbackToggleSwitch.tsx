import React from 'react'
import { ButtonGroup, Button } from '@wings-software/uikit'
import i18n from './RollbackToggleSwitch.i18n'
import { StepsType } from '../../Constants'
import css from './RollbackToggleSwitch.module.scss'

export interface RollbackToggleSwitchProps {
  active?: StepsType
  style?: React.CSSProperties
  onChange?: (type: StepsType) => void
}

export const RollbackToggleSwitch: React.FC<RollbackToggleSwitchProps> = ({
  style = {},
  active = StepsType.Normal,
  onChange
}): JSX.Element => {
  return (
    <span style={style} className={css.btnRollback}>
      <ButtonGroup>
        <Button
          icon="command-start"
          active={active === StepsType.Normal}
          tooltip={i18n.steps}
          iconProps={{ size: 12 }}
          onClick={() => onChange?.(StepsType.Normal)}
        />
        <Button
          icon="command-rollback"
          active={active === StepsType.Rollback}
          tooltip={i18n.rollback}
          iconProps={{ size: 12 }}
          onClick={() => onChange?.(StepsType.Rollback)}
        />
      </ButtonGroup>
    </span>
  )
}
