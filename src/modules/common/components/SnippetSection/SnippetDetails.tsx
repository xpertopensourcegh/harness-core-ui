import React, { useState, useEffect } from 'react'
import type { MouseEvent } from 'react'
import cx from 'classnames'

import i18n from './SnippetDetails.i18n'
import { Icon } from '@wings-software/uikit'
import copy from 'copy-to-clipboard'
import { YAMLService } from 'modules/dx/services'
import type { SnippetInterface } from '../../interfaces/SnippetInterface'

import css from './SnippetDetails.module.scss'

interface SnippetDetailsProps {
  entityType: string
  selectedIcon: string
}

const onCopy = (): void => {
  // alert('Snippet copied!')
}
const copyToClipboard = (event: MouseEvent, snippetYaml: string): void => {
  event.preventDefault()
  copy(snippetYaml)
  onCopy()
}

const getSnippetDetail = (snippet: SnippetInterface): React.ReactElement => {
  return (
    <div className={cx(css.flexCenter, css.snippet)} key={snippet.name}>
      <span className={css.icon}>
        <Icon name={'service-kubernetes'} size={25} />
      </span>
      <div className={css.fullWidth}>
        <div className={css.name}>
          <div className={css.snippetName}>{snippet.name}</div>
          <div className={css.snippetVersion}>
            {i18n.version} {snippet.version}
          </div>
        </div>
        <span className={css.description}>{snippet.description}</span>
        <div className={cx(css.copy, css.flexCenter)} onClick={event => copyToClipboard(event, snippet.yaml)}>
          <Icon name="copy" size={15} className={css.snippetIcon} />
          <span title={i18n.copyToClipboard}>{i18n.copyToClipboard}</span>
        </div>
      </div>
    </div>
  )
}

const SnippetDetails: React.FC<SnippetDetailsProps> = props => {
  const [snippets, setSnippets] = useState([] as SnippetInterface[])
  const [searchedSnippet, setSearchedSnippet] = useState('')

  const fetchSnippets = (entityType: string): void => {
    const snippetsFetched = YAMLService.fetchSnippets(entityType) as SnippetInterface[]
    // Randomizing to provide update effect
    setSnippets(snippetsFetched)
  }

  const onSnippetSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault()
    const query = event.target.value
    setSearchedSnippet(query)
    setSnippets(snippets.slice().filter(snippet => snippet.name.toLowerCase().includes(query.toLowerCase())))
  }

  const onSearchClear = (event: React.MouseEvent<HTMLElement>): void => {
    event.preventDefault()
    setSearchedSnippet('')
    fetchSnippets(props.entityType)
  }

  //TODO Handle icon click when apis are ready
  useEffect(() => {
    fetchSnippets(props.entityType)
  }, [props.entityType, props.selectedIcon])

  return (
    <div className={css.main}>
      <div className={css.title}>
        {props.entityType}&nbsp;
        {i18n.title}
      </div>
      <div className={css.searchBar}>
        <span className={css.searchIcon}>
          <Icon name={'main-search'} size={20} />
        </span>
        <input
          placeholder="Search"
          name="snippet-search"
          className={css.search}
          onChange={onSnippetSearch}
          value={searchedSnippet}
        />
        {searchedSnippet ? (
          <span className={css.closeIcon}>
            <Icon name={'main-close'} size={10} onClick={onSearchClear} />
          </span>
        ) : null}
      </div>
      <div className={css.snippets}>{snippets.map(snippet => getSnippetDetail(snippet))}</div>
    </div>
  )
}

export default SnippetDetails
