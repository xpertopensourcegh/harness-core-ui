import React from 'react'
import { Container, ExpandingSearchInput, Icon, Text } from '@wings-software/uikit'
import css from './LogsHeader.module.scss'

interface LogsHeaderProps {
  onNext(searchText: string): void
  onPrev(searchText: string): void
  searchDir: string
  subHeader?: string
}
const LogsHeader = (props: LogsHeaderProps) => {
  const { subHeader = 'Log Message', searchDir } = props

  const onSearch = (text: string) => {
    if (searchDir === 'prev') {
      props.onPrev(text)
    } else if (searchDir === 'next') {
      props.onNext(text)
    }
  }

  return (
    <Container className={css.headerContainer}>
      <header className={css.logsHeader}>
        <section className={css.headerContent}>
          <Text className={css.header}>Console logs</Text>
          <Text font="small" className={css.subHeader}>
            {subHeader}
          </Text>
        </section>
        <div></div>
      </header>
      <section className={css.headerActions}>
        <div className={css.searchInput}>
          <ExpandingSearchInput
            onChange={onSearch}
            onEnter={onSearch}
            placeholder="Search"
            onPrev={props.onPrev}
            onNext={props.onNext}
            showPrevNextButtons
            throttle={200}
          />
        </div>

        <Icon name="download" size={16} />
        <Icon name="cross" size={16} />
      </section>
    </Container>
  )
}

export default LogsHeader
