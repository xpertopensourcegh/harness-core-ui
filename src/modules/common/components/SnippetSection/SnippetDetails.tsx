import React, { useState } from 'react'
import type { MouseEvent } from 'react'
import cx from 'classnames'

import i18n from './SnippetDetails.i18n'
import { Icon } from '@wings-software/uikit'
import copy from 'copy-to-clipboard'

import css from './SnippetDetails.module.scss'

interface SnippetDetailsProps {
  entityType: string
  selectedIcon: string
}

interface SnippetInteface {
  name: string
  version: string
  description?: string
  yaml: string
}

const onCopy = () => {
  alert('Snippet copied!')
}
const copyToClipboard = (event: MouseEvent, snippetYaml: string) => {
  event.preventDefault()
  copy(snippetYaml)
  onCopy()
}

const getSnippetDetail = (snippet: SnippetInteface) => {
  return (
    <div className={cx(css.flexCenter, css.snippet)} key={snippet.name}>
      <span className={css.icon}>
        <Icon name={'service-kubernetes'} size={25} />
      </span>
      <div className={css.fullWidth}>
        <div className={css.name}>
          <div className={css.snippetName}>{snippet.name}</div>
          <div className={css.snippetVersion}>Version {snippet.version}</div>
        </div>
        <span className={css.description}>{snippet.description}</span>
        <div className={cx(css.copy, css.flexCenter)} onClick={event => copyToClipboard(event, snippet.yaml)}>
          <Icon name="copy" size={15} className={css.snippetIcon} />
          <span title={'Click to Clipboard'}>Copy to Clipboard</span>
        </div>
      </div>
    </div>
  )
}

const SnippetDetails = (props: SnippetDetailsProps) => {
  const placeHolderSnippet =
    "spec:\r\n  access: outside-cluster\r\n  masterUrl: 'https://34.67.13.218'\r\n  k8s-auth: \r\n  type: user-password\r\n  spec: \r\n  username: admin\r\n  password: kube_cluster_password\r\n  cacert: 'secretRef:kube_cluster_cacert'\r\n"
  const [snippets, setSnippets] = useState([
    {
      name: 'Kubernetes Deployment',
      version: '1.1',
      description: 'A Deployment Stage with Kubernetes Setup',
      yaml: placeHolderSnippet
    },
    {
      name: 'Amazon ECS Deployment',
      version: '1.1',
      description: 'A Deployment Stage with Amazon ECS Setup',
      yaml: placeHolderSnippet
    },
    {
      name: 'PCF Deployment',
      version: '1.1',
      description: 'A Deployment Stage with PCF Setup',
      yaml: placeHolderSnippet
    },
    {
      name: 'AWS CodeDeploy',
      version: '1.1',
      description: 'A Deployment Stage with CodeDeploy Setup',
      yaml: placeHolderSnippet
    }
  ])

  const onSnippetSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSnippets(snippets.filter(snippet => snippet.name.toLowerCase() === event.target.value.toLowerCase()))
  }

  //TODO Handle icon click when apis are ready
  // useEffect(() => {}, [props.entityType])

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
        <input placeholder="Search" name="snippet-search" className={css.search} onChange={onSnippetSearch} />
      </div>
      <div className={css.snippets}>{snippets.map(snippet => getSnippetDetail(snippet))}</div>
    </div>
  )
}

export default SnippetDetails
