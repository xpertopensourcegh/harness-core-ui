import React, { useState, useEffect } from 'react'

import type { YamlSnippetMetaData } from 'services/cd-ng'
import i18n from './SnippetDetails.i18n'
import type { YamlEntity } from '../../constants/YamlConstants'
import Snippet from './Snippet'

import css from './SnippetDetails.module.scss'

interface SnippetDetailsProps {
  entityType: YamlEntity
  selectedIcon?: string
  snippets?: YamlSnippetMetaData[]
  onSnippetSearch?: (query: string) => void
  height?: React.CSSProperties['height']
  mockSnippetData?: any
}

const SnippetDetails: React.FC<SnippetDetailsProps> = props => {
  const { height, entityType, mockSnippetData } = props
  const [snippets, setSnippets] = useState<YamlSnippetMetaData[]>()
  //TODO @enable when search is integrated from backend
  // const [searchedSnippet, setSearchedSnippet] = useState('')

  // const handleSnippetSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
  //   event.preventDefault()
  //   const query = event.target.value
  //   setSearchedSnippet(query)
  //   onSnippetSearch?.(query)
  //   alert('TBD')
  // }

  // const onSearchClear = (event: React.MouseEvent<HTMLElement>): void => {
  //   event.preventDefault()
  //   setSearchedSnippet('')
  //   onSnippetSearch?.('')
  // }

  //TODO Handle icon click when apis are ready
  useEffect(() => {
    setSnippets(props.snippets)
  }, [props.snippets])

  return (
    <div className={css.main}>
      <div className={css.title}>
        {entityType}&nbsp;
        {i18n.title}
      </div>
      {/* <div className={css.searchBar}>
        <span className={css.searchIcon}>
          <Icon name={'main-search'} size={20} />
        </span>
        <input
          placeholder="Search"
          name="snippet-search"
          className={css.search}
          onChange={handleSnippetSearch}
          value={searchedSnippet}
        />
        {searchedSnippet ? (
          <span className={css.closeIcon}>
            <Icon name={'main-close'} size={10} onClick={onSearchClear} />
          </span>
        ) : null}
      </div> */}
      <div className={css.snippets} style={{ maxHeight: height, overflow: 'auto' }}>
        {snippets?.map(snippet => (
          <Snippet key={snippet.name} {...snippet} mockData={mockSnippetData} />
        ))}
      </div>
    </div>
  )
}

export default SnippetDetails
