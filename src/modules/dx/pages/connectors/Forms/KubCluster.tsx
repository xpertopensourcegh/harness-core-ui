import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { FormInput, Layout } from '@wings-software/uikit'
import { CardSelect, Icon } from '@wings-software/uikit'
import ConnectorFormFields from 'modules/dx/components/connectors/ConnectorFormFields/ConnectorFormFields'
import type { FormData } from 'modules/dx/interfaces/ConnectorInterface'
import { authOptions, DelegateTypes, DelegateInClusterType, getIconsForCard } from './KubeFormHelper'

import i18n from './KubCluster.i18n'

// import type { AuthOption } from './KubeFormHelper'
import css from './KubCluster.module.scss'

interface SelectedDelegate {
  type: string
  value: string
  icon: string
}
interface KubClusterProps {
  accountId: string
  projectIdentifier: string
  orgIdentifier: string
  enableEdit?: boolean
  connector: FormData
  enableCreate?: boolean
  formikProps: any
}

interface KubClusterState {
  selectedDelegate: SelectedDelegate
  setSelectedDelegate: (val: SelectedDelegate) => void
  authentication: string
  setAuthentication: (val: string) => void
  inclusterDelegate: string
  setInClusterDelegate: (val: string) => void
  showCreateSecretModal: boolean
  setShowCreateSecretModal: (val: boolean) => void
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
// const getDelegateInclusterData = () => {
//   return [
//     {
//       label: 'Use an existing Delegate',
//       value: 'useexistingDelegate'
//       // selected:true
//     },
//     {
//       label: 'Add a new Delegate to this Cluster',
//       value: 'newDelegate'
//       // selected:false
//     }
//   ]
// }

const selectExistingDelegate = () => {
  return (
    <FormInput.Select
      name="inheritConfigFromDelegate"
      label="Select Delegate"
      items={[
        { label: 'Delegate_one', value: 'Delegate_one' },
        { label: 'Delegate_two', value: 'Delegate_two' }
      ]}
    />
  )
}

const renderDelegateInclusterForm = (state: KubClusterState) => {
  return (
    <div className={css.incluster}>
      <div
        className={css.radioOption}
        onClick={() => {
          state.setInClusterDelegate(DelegateInClusterType.useExistingDelegate)
        }}
      >
        <input type="radio" checked={state.inclusterDelegate === DelegateInClusterType.useExistingDelegate} />
        <span className={css.label}>Use an existing Delegate</span>
      </div>
      {state.inclusterDelegate === DelegateInClusterType.useExistingDelegate ? selectExistingDelegate() : null}
      <div
        onClick={() => {
          state.setInClusterDelegate(DelegateInClusterType.addNewDelegate)
        }}
      >
        <input type="radio" checked={state.inclusterDelegate === DelegateInClusterType.addNewDelegate} disabled />
        <span className={css.label}>Add a new Delegate to this Cluster</span>
      </div>
    </div>
  )
}
// Todo: Move this to React component
const renderDelegateOutclusterForm = (state: KubClusterState, props: KubClusterProps) => {
  return (
    <div className={css.delgateOutCluster}>
      <FormInput.Text label={i18n.masterUrl} name="masterUrl" />
      <Layout.Horizontal className={css.credWrapper}>
        <div className={css.heading}>Credentials</div>
        <FormInput.Select
          name="authType"
          items={authOptions}
          className={css.selectAuth}
          onChange={val => {
            if (typeof val.value === 'string') {
              state.setAuthentication(val?.value)
            }
          }}
        />
      </Layout.Horizontal>
      <ConnectorFormFields
        accountId={props.accountId}
        orgIdentifier={props.orgIdentifier}
        projectIdentifier={props.projectIdentifier}
        formikProps={props.formikProps}
        authType={state.authentication}
        name={props.formikProps?.values?.name}
        onClickCreateSecret={() => state.setShowCreateSecretModal(true)}
      />
    </div>
  )
}

const KubCluster = (props: KubClusterProps): JSX.Element => {
  const [selectedDelegate, setSelectedDelegate] = useState({ type: '', value: '', icon: '' })
  const [authentication, setAuthentication] = useState('')
  const [inclusterDelegate, setInClusterDelegate] = useState('')
  const [showCreateSecretModal, setShowCreateSecretModal] = useState<boolean>(false)
  const { connector } = props
  const state: KubClusterState = {
    selectedDelegate,
    setSelectedDelegate,
    authentication,
    setAuthentication,
    inclusterDelegate,
    setInClusterDelegate,
    showCreateSecretModal,
    setShowCreateSecretModal
  }
  const radioProps = {
    data: delegateData,
    className: css.delegateSetup,
    renderItem: function renderItem(item: any) {
      return (
        <div className={cx(css.cardCss, { [css.selectedCard]: item.type === selectedDelegate?.type })}>
          <div className={css.cardContent}>
            {item.value}
            {getIconsForCard(item.type, item.type === selectedDelegate?.type)}
          </div>
          {item.type === selectedDelegate?.type ? (
            <Icon name="deployment-success-new" size={16} className={css.tickWrp} />
          ) : null}
        </div>
      )
    },
    onChange: (item: SelectedDelegate) => {
      state.setSelectedDelegate(item)
      props.formikProps.setFieldValue('delegateType', item.type)
    }
  }
  useEffect(() => {
    if (props.formikProps?.values?.authType) {
      state.setAuthentication(props.formikProps.values.authType)
    }
    if (props.formikProps?.values?.delegateType) {
      const val = { type: props.formikProps?.values?.delegateType, value: '', icon: '' }
      state.setSelectedDelegate(val)
    }
    if (props.formikProps.values?.inheritConfigFromDelegate) {
      state.setInClusterDelegate(DelegateInClusterType.useExistingDelegate)
    }
  }, [props])

  return (
    <>
      <FormInput.InputWithIdentifier isIdentifierEditable={false} />
      <FormInput.TextArea label={i18n.description} name="description" />
      <FormInput.TagInput
        name="tags"
        label={i18n.tags}
        items={connector?.tags}
        labelFor={name => (typeof name === 'string' ? name : '')}
        itemFromNewTag={newTag => newTag}
        className={css.tags}
        tagInputProps={{
          noInputBorder: true,
          openOnKeyDown: false,
          showAddTagButton: true,
          showClearAllButton: true,
          allowNewTag: true,
          placeholder: i18n.enterTags
        }}
      />
      <CardSelect {...radioProps} selected={selectedDelegate} />
      {state.selectedDelegate?.type === DelegateTypes.DELEGATE_IN_CLUSTER ? renderDelegateInclusterForm(state) : null}
      {state.selectedDelegate?.type === DelegateTypes.DELEGATE_OUT_CLUSTER
        ? renderDelegateOutclusterForm(state, props)
        : null}
    </>
  )
}

export default KubCluster
