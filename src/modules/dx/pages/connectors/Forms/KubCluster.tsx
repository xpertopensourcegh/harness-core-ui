import React, { useState } from 'react'
import { FormInput, Layout } from '@wings-software/uikit'
import i18n from './KubCluster.i18n'
import { RadioSelect, Select } from '@wings-software/uikit'
import type { ConnectorSchema } from '../ConnectorSchema'
import css from './KubCluster.module.scss'
import { authOptions, getCustomFields } from './KubeFormHelper'
// import type { AuthOption } from './KubeFormHelper'

interface SelectedDelegate {
  type: string
  value: string
  icon: string
}
interface KubClusterProps {
  enableEdit: boolean
  connector: ConnectorSchema
}

interface KubClusterState {
  selectedDelegate: SelectedDelegate
  setSelectedDelegate: (val: SelectedDelegate) => void
  authentication: string
  setAuthentication: (val: string) => void
}
const DelegateTypes = {
  DELEGATE_IN_CLUSTER: i18n.DELEGATE_IN_CLUSTER,
  DELEGATE_OUT_CLUSTER: i18n.DELEGATE_OUT_CLUSTER
}

const delegateData = [
  {
    type: DelegateTypes.DELEGATE_IN_CLUSTER,
    value: i18n.DELEGATE_IN_CLUSTER_TEXT,
    icon: 'blank'
  },
  {
    type: DelegateTypes.DELEGATE_OUT_CLUSTER,
    value: i18n.DELEGATE_OUT_CLUSTER_TEXT,
    icon: 'blank'
  }
]

const renderDelegateInclusterForm = () => {
  return <></>
}

const renderDelegateOutclusterForm = (state: KubClusterState) => {
  return (
    <div className={css.delgateOutCluster}>
      <FormInput.Text label={i18n.masterUrl} name="masterUrl" />
      <Layout.Horizontal className={css.credWrapper}>
        <div className={css.heading}>Credentials</div>
        <Select
          items={authOptions}
          className={css.selectAuth}
          onChange={val => {
            if (typeof val.value === 'string') {
              state.setAuthentication(val?.value)
            }
          }}
        />
      </Layout.Horizontal>
      {getCustomFields(state.authentication)}
    </div>
  )
}

const KubCluster = (props: KubClusterProps): JSX.Element => {
  const [selectedDelegate, setSelectedDelegate] = useState({ type: '', value: '', icon: '' })
  const [authentication, setAuthentication] = useState('')
  const { connector } = props

  const state: KubClusterState = {
    selectedDelegate,
    setSelectedDelegate,
    authentication,
    setAuthentication
  }
  const radioProps = {
    data: delegateData,
    className: css.delegateSetup,
    renderItem: function renderItem(item: any) {
      return <div className={css.cardCss}>{item.value}</div>
    },
    onChange: (item: SelectedDelegate) => {
      state.setSelectedDelegate(item)
    }
  }

  return (
    <>
      <FormInput.Text label={i18n.displayName} name="name" />
      <FormInput.TextArea label={i18n.description} name="description" />
      <FormInput.Text label={i18n.identifier} name="identifier" />
      <FormInput.TagInput
        name="tags"
        label={i18n.tags}
        items={connector.tags}
        labelFor={name => (typeof name === 'string' ? name : '')}
        itemFromNewTag={newTag => newTag}
        tagInputProps={{
          noInputBorder: true,
          openOnKeyDown: false,
          showAddTagButton: true,
          showClearAllButton: true,
          allowNewTag: true,
          placeholder: i18n.enterTags
        }}
      />
      <RadioSelect {...radioProps} selected={selectedDelegate} />
      {state.selectedDelegate?.type === DelegateTypes.DELEGATE_IN_CLUSTER ? renderDelegateInclusterForm() : null}
      {state.selectedDelegate?.type === DelegateTypes.DELEGATE_OUT_CLUSTER ? renderDelegateOutclusterForm(state) : null}
    </>
  )
}

export default KubCluster
