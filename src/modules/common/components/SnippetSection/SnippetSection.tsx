import React, { useState } from 'react'

import { Icon, IconName } from '@wings-software/uikit'
import { SnippetMenuIcons, YamlEntity } from '../../constants/YamlConstants'

import SnippetDetails from './SnippetDetails'
import type { SnippetInterface } from '../../interfaces/SnippetInterface'
import css from './SnippetSection.module.scss'

interface SnippetSectionProps {
  entityType: typeof YamlEntity
  showIconMenu?: boolean
  snippets: SnippetInterface[]
  onSnippetSearch: (arg0: string) => void
}

const SnippetSection: React.FC<SnippetSectionProps> = props => {
  const { showIconMenu, snippets, entityType, onSnippetSearch } = props
  const icons = [
    { name: SnippetMenuIcons.get(YamlEntity.ENVIRONMENT), label: 'Environment' },
    { name: SnippetMenuIcons.get(YamlEntity.INPUT_SET), label: 'Input Set' },
    { name: SnippetMenuIcons.get(YamlEntity.NOTIFICATION), label: 'Notification' },
    { name: SnippetMenuIcons.get(YamlEntity.STAGE), label: 'Stage' },
    { name: SnippetMenuIcons.get(YamlEntity.STEP), label: 'Step' },
    { name: SnippetMenuIcons.get(YamlEntity.TRIGGER), label: 'Trigger' }
  ]

  const [selectedIcon, setSelectedIcon] = useState(icons[0].name)

  const onIconClick = (event: any, icon?: string): void => {
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
      {showIconMenu ? <div className={css.snippetIcons}>{getIconList()}</div> : null}
      <div className={css.snippets}>
        <SnippetDetails
          entityType={entityType}
          selectedIcon={selectedIcon}
          snippets={snippets}
          onSnippetSearch={onSnippetSearch}
        />
      </div>
    </div>
  )
}

export default SnippetSection
