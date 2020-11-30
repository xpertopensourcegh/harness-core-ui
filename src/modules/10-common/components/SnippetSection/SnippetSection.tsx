import React, { useState } from 'react'
import { Icon, IconName } from '@wings-software/uikit'
import cx from 'classnames'
import { Spinner } from '@blueprintjs/core'

import { YamlEntity } from '@common/constants/YamlConstants'
import { useGetYamlSnippetMetadata, YamlSnippetMetaData } from 'services/cd-ng'
import type { GetYamlSnippetMetadataQueryParams } from 'services/cd-ng'
import { getIconNameForTag } from '@common/utils/SnippetUtils'
import SnippetDetails from './SnippetDetails'
import type { SnippetSectionProps } from '../../interfaces/SnippetInterface'

import css from './SnippetSection.module.scss'

const getSnippetTags = (entityType?: YamlEntity, entitySubType?: string): GetYamlSnippetMetadataQueryParams['tags'] => {
  const tags: GetYamlSnippetMetadataQueryParams['tags'] = []
  switch (entityType) {
    case YamlEntity.CONNECTOR:
      tags.push('connector')
      switch (entitySubType) {
        case 'K8sCluster':
          tags.push('k8s')
          break
        case 'DockerRegistry':
          tags.push('docker')
          break
      }
      break
    default:
  }
  return tags
}

const SnippetSection: React.FC<SnippetSectionProps> = props => {
  const { showIconMenu, entityType, entitySubType, onSnippetSearch, height, mockMetaData, mockSnippetData } = props
  const { data: snippetData, loading } = useGetYamlSnippetMetadata({
    queryParams: {
      tags: getSnippetTags(entityType, entitySubType)
    },
    queryParamStringifyOptions: {
      arrayFormat: 'repeat'
    },
    requestOptions: { headers: { accept: 'application/json' } },
    mock: mockMetaData
  })

  const [selectedIcon, setSelectedIcon] = useState<string | undefined>('')

  const onIconClick = (event: React.MouseEvent<Element, MouseEvent>, icon?: string): void => {
    event.preventDefault()
    setSelectedIcon(icon)
    alert('TBD')
  }

  const getIconCategories = (snippets?: YamlSnippetMetaData[]): IconName[] | null => {
    if (!snippets) {
      return null
    }
    return [...new Set(snippets.map(snippet => getIconNameForTag(snippet?.iconTag || '')))]
  }

  const getIconList = (snippets?: YamlSnippetMetaData[]): React.ReactElement | null => {
    if (!snippets) {
      return null
    }
    return (
      <React.Fragment>
        {getIconCategories(snippets)?.map(icon => (
          <div className={css.snippetIcon} key={icon} onClick={event => onIconClick(event, icon)} title={icon}>
            <Icon name={icon as IconName} size={25} />
          </div>
        ))}
      </React.Fragment>
    )
  }

  const snippets = snippetData?.data?.yamlSnippets || []

  return (
    <div className={css.main}>
      {showIconMenu ? <div className={css.snippetIcons}>{getIconList(snippets)}</div> : null}
      {loading ? (
        <div className={css.fillSpace}>
          <Spinner size={25} />
        </div>
      ) : snippetData?.data?.yamlSnippets ? (
        <div className={css.snippets}>
          <SnippetDetails
            entityType={entityType}
            selectedIcon={selectedIcon}
            snippets={snippets}
            onSnippetSearch={onSnippetSearch}
            height={height}
            mockSnippetData={mockSnippetData}
          />
        </div>
      ) : (
        <div className={cx(css.noSnippets, css.fillSpace)}>No snippets found.</div>
      )}
    </div>
  )
}

export default SnippetSection
