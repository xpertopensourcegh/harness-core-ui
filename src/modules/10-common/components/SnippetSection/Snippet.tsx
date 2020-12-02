import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { Position, PopoverInteractionKind } from '@blueprintjs/core'
import { Popover } from '@blueprintjs/core'
import copy from 'copy-to-clipboard'
import type { MouseEvent } from 'react'

import { Icon, IconName } from '@wings-software/uikit'
import { getIconNameForTag } from '@common/utils/SnippetUtils'
import type { YamlSnippetMetaData } from 'services/cd-ng'
import i18n from './Snippet.i18n'

import css from './Snippet.module.scss'

type SnippetInterface = YamlSnippetMetaData & {
  onSnippetCopy?: (identifier: string) => void
  snippetYaml?: string
}

const Snippet: React.FC<SnippetInterface> = props => {
  const { name, description, version, identifier, iconTag, onSnippetCopy, snippetYaml } = props
  const [tooltipLabel, setTooltipLabel] = useState(i18n.copyToClipboard)

  const onCopy = (): void => {
    setTooltipLabel(i18n.copied)
  }

  const copyToClipboard = (event: MouseEvent): void => {
    event.preventDefault()
    if (identifier) {
      onSnippetCopy?.(identifier)
    }
  }

  useEffect(() => {
    copy(snippetYaml as string)
    onCopy()
  }, [snippetYaml])

  const getPopoverContent = (): JSX.Element => {
    return <span className={css.tooltipLabel}>{tooltipLabel}</span>
  }

  return (
    <div className={cx(css.flexCenter, css.snippet)} key={name}>
      <span className={css.icon}>
        <Icon name={getIconNameForTag(iconTag || '') as IconName} size={25} />
      </span>
      <div className={css.fullWidth}>
        <div className={css.name}>
          <div className={css.snippetName}>{name}</div>
        </div>
        <div className={css.description}>{description}</div>
        <div className={css.snippetVersion}>
          {i18n.version} {version}
        </div>
      </div>
      <Popover
        minimal
        position={Position.BOTTOM}
        interactionKind={PopoverInteractionKind.HOVER}
        content={getPopoverContent()}
        onOpening={() => setTooltipLabel(i18n.copyToClipboard)}
      >
        <div className={css.copy}>
          <Icon name="copy" size={20} className={css.snippetIcon} onClick={event => copyToClipboard(event)} />
        </div>
      </Popover>
    </div>
  )
}

export default Snippet
