import { Container, IconName, ButtonProps } from '@wings-software/uikit'
import React, { useState, useEffect } from 'react'
import css from './PageBody.module.scss'
import { PageSpinner } from './PageSpinner'
import { PageError } from './PageError'
import { NoDataCard } from './NoDataCard'

export interface PageBodyProps {
  /** If set to true, spinner should be shown */
  loading?: boolean

  /** If not nullable, show page error */
  error?: string

  /** If passed, render 'Retry' button alongside error message */
  retryOnError?: ButtonProps['onClick']

  /** noData structure */
  noData?: {
    /** when true, show <NoDataCard/> */
    when: () => boolean

    /** icon to pass to <NoDataCard/> */
    icon: IconName

    /** message to pass to <NoDataCard/> */
    message: string

    /** button text to pass to <NoDataCard/> */
    buttonText: string

    /** onClick event handler to pass to <NoDataCard/> */
    onClick: ButtonProps['onClick']
  }
}

/**
 * PageBody implements page body container with some decorations like background image,
 * alignments, etc...
 */
export const PageBody: React.FC<PageBodyProps> = ({ children, loading: _loading, error, retryOnError, noData }) => {
  const [loading, setLoading] = useState(_loading)
  const [firstLoading, setFirstLoading] = useState(_loading)

  // TODO: Implement Page spinner logic (make sure error and no-data work as expected):
  //  - If _loading turns from true to false within 250ms, no spinner is shown (API is so fast)
  //  - If _loading turns from true to false after 250ms, but within 1s, spinner is hidden after 1s
  //  - Else show spinner when _loading is true, and hide when it turns to false
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (_loading === false) {
      setFirstLoading(false)

      // Explicitly delay hiding spinner 1s after loading is done
      // to gain a little better experience
      if (loading) {
        timeoutId = setTimeout(() => setLoading(false), 1000)
      }
    }

    return () => clearTimeout(timeoutId)
  }, [_loading]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container className={css.pageBody}>
      {loading && <PageSpinner />}
      {!loading && error && <PageError message={error} onClick={retryOnError} />}
      {!loading && !error && noData?.when?.() && (
        <NoDataCard
          icon={noData?.icon}
          message={noData?.message || ''}
          buttonText={noData?.buttonText || ''}
          onClick={noData?.onClick}
        />
      )}
      {!firstLoading && !error && !noData?.when?.() && children}
    </Container>
  )
}
