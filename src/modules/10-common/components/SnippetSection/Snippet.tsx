import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { Position, PopoverInteractionKind, Spinner, Intent } from '@blueprintjs/core'
import { Popover } from '@blueprintjs/core'

import { Icon, IconName } from '@wings-software/uikit'
import { getIconNameForTag } from '@common/utils/SnippetUtils'
import type { YamlSnippetMetaData } from 'services/cd-ng'
import { useStrings } from 'framework/exports'

import css from './Snippet.module.scss'

type SnippetInterface = YamlSnippetMetaData & {
  onSnippetCopy?: (identifier: string) => Promise<void>
  snippetYaml?: string
}

const Snippet: React.FC<SnippetInterface> = props => {
  const { getString } = useStrings()
  const { name, description, version, identifier, iconTag, onSnippetCopy, snippetYaml } = props
  const [tooltipLabel, setTooltipLabel] = useState(getString('snippets.copyToClipboard'))
  const [isFetching, setIsFetching] = useState<boolean>(false)

  useEffect(() => {
    navigator?.clipboard?.writeText(snippetYaml || '')
  }, [snippetYaml])

  const getPopoverContent = (): JSX.Element => {
    return (
      <div className={css.popoverContent}>
        <span className={css.tooltipLabel}>{tooltipLabel} </span>
        {isFetching ? <Spinner size={Spinner.SIZE_SMALL} intent={Intent.PRIMARY} /> : null}
      </div>
    )
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
          {getString('snippets.version')} {version}
        </div>
      </div>
      <Popover
        minimal
        position={Position.BOTTOM}
        interactionKind={PopoverInteractionKind.HOVER}
        content={getPopoverContent()}
        onOpening={() => setTooltipLabel(getString('snippets.copyToClipboard'))}
      >
        <div className={css.copy}>
          <Icon
            name="copy"
            size={20}
            className={css.snippetIcon}
            onClick={async (event: React.MouseEvent<HTMLHeadingElement, globalThis.MouseEvent>) => {
              event.preventDefault()
              event.stopPropagation()
              setIsFetching(true)
              setTooltipLabel(getString('fetching').concat('...'))
              if (identifier) {
                await onSnippetCopy?.(identifier)
              }
              setTooltipLabel(getString('snippets.copied'))
              setIsFetching(false)
            }}
          />
        </div>
      </Popover>
    </div>
  )
}

export default Snippet
