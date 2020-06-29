import React, { useState } from 'react'

import { Icon, IconName } from '@wings-software/uikit'

import css from './SnippetSection.module.scss'
import SnippetDetails from './SnippetDetails'

interface SnippetSectionProps {
  entityType: string
  isPipelineBuilderView?: boolean
}

const SnippetSection = (props: SnippetSectionProps) => {
  const icons = [
    { name: 'yaml-builder-env', label: 'Environment' },
    { name: 'yaml-builder-input-sets', label: 'Input Set' },
    { name: 'yaml-builder-notifications', label: 'Notification' },
    { name: 'yaml-builder-stages', label: 'Stage' },
    { name: 'yaml-builder-steps', label: 'Step' },
    { name: 'yaml-builder-trigger', label: 'Trigger' }
  ]

  const [selectedIcon, setSelectedIcon] = useState(icons[0].name)

  const onIconClick = (event: any, icon: string) => {
    event.preventDefault()
    setSelectedIcon(icon)
  }

  const getIconList = () => {
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
      {props.isPipelineBuilderView ? <div className={css.snippetIcons}>{getIconList()}</div> : null}
      <div className={css.snippets}>
        <SnippetDetails selectedIcon={selectedIcon} entityType={props.entityType} />
      </div>
    </div>
  )
}

export default SnippetSection
