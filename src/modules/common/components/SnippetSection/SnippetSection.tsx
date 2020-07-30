import React, { useState } from 'react'

import { Icon, IconName } from '@wings-software/uikit'

import SnippetDetails from './SnippetDetails'
import css from './SnippetSection.module.scss'

interface SnippetSectionProps {
  entityType: string
  showIconMenu?: boolean
}

const SnippetSection: React.FC<SnippetSectionProps> = props => {
  const icons = [
    { name: 'yaml-builder-env', label: 'Environment' },
    { name: 'yaml-builder-input-sets', label: 'Input Set' },
    { name: 'yaml-builder-notifications', label: 'Notification' },
    { name: 'yaml-builder-stages', label: 'Stage' },
    { name: 'yaml-builder-steps', label: 'Step' },
    { name: 'yaml-builder-trigger', label: 'Trigger' }
  ]

  const [selectedIcon, setSelectedIcon] = useState(icons[0].name)

  const onIconClick = (event: any, icon: string): void => {
    event.preventDefault()
    setSelectedIcon(icon)
  }

  const getIconList = (): React.ReactElement => {
    return (
      <React.Fragment>
        {icons.map(icon => (
          <div
            className={css.snippetIcon}
            key={icon.name}
            onClick={event => onIconClick(event, icon.name)}
            title={icon.label}
          >
            <Icon name={icon.name as IconName} size={25} />
          </div>
        ))}
      </React.Fragment>
    )
  }

  return (
    <div className={css.main}>
      {props.showIconMenu ? <div className={css.snippetIcons}>{getIconList()}</div> : null}
      <div className={css.snippets}>
        <SnippetDetails selectedIcon={selectedIcon} entityType={props.entityType} />
      </div>
    </div>
  )
}

export default SnippetSection
