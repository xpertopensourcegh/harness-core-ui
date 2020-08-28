import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { FormInput, Layout, SelectV2, Button, SelectOption } from '@wings-software/uikit'
import { CardSelect, Icon } from '@wings-software/uikit'
import ConnectorFormFields from 'modules/dx/components/connectors/ConnectorFormFields/ConnectorFormFields'
import type { FormData } from 'modules/dx/interfaces/ConnectorInterface'
import { useGetKubernetesDelegateNames, RestResponseListString } from 'services/portal'
import { authOptions, DelegateTypes, DelegateInClusterType, getIconsForCard } from './KubeFormHelper'
import { AuthTypes, getLabelForAuthType } from '../utils/ConnectorHelper'
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
  authentication: SelectOption
  setAuthentication: (type: SelectOption) => void
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

const formatDelegateList = (listData: string[] | undefined) => {
  return listData?.map((item: string) => {
    return { label: item || '', value: item || '' }
  })
}
// Todo: Move this to React component
const renderDelegateInclusterForm = (state: KubClusterState, delegateList: RestResponseListString) => {
  const delegateListFiltered = formatDelegateList(delegateList?.resource) || [{ label: '', value: '' }]
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
      {state.inclusterDelegate === DelegateInClusterType.useExistingDelegate ? (
        <FormInput.Select name="delegateName" label="Select Delegate" items={delegateListFiltered} />
      ) : null}
      <div
        className={css.radioOptionInstall}
        onClick={() => {
          state.setInClusterDelegate(DelegateInClusterType.addNewDelegate)
        }}
      >
        <input type="radio" checked={state.inclusterDelegate === DelegateInClusterType.addNewDelegate} />
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
        <div className={css.label}>
          <Icon name="lock" size={14} className={css.lockIcon} />
          Credentials
        </div>
        <SelectV2
          items={authOptions}
          value={state.authentication}
          filterable={false}
          onChange={val => {
            state.setAuthentication(val)
            props.formikProps.setFieldValue('authType', val.value)
          }}
          className={css.selectAuth}
        >
          <Button text={state.authentication?.label} rightIcon="chevron-down" minimal />
        </SelectV2>
      </Layout.Horizontal>
      <ConnectorFormFields
        accountId={props.accountId}
        orgIdentifier={props.orgIdentifier}
        projectIdentifier={props.projectIdentifier}
        formikProps={props.formikProps}
        authType={state.authentication.value}
        name={props.formikProps?.values?.name}
        onClickCreateSecret={() => state.setShowCreateSecretModal(true)}
        isEditMode={true}
      />
    </div>
  )
}

const KubCluster: React.FC<KubClusterProps> = props => {
  const [selectedDelegate, setSelectedDelegate] = useState({ type: '', value: '', icon: '' })
  const [authentication, setAuthentication] = useState({
    label: 'Username and Password',
    value: AuthTypes.USER_PASSWORD
  } as SelectOption)
  const { accountId } = props

  const { loading, data: delegateList } = useGetKubernetesDelegateNames({
    queryParams: { accountId }
  })

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
      state.setAuthentication({
        label: getLabelForAuthType(props.formikProps.values.authType),
        value: props.formikProps.values.authType
      })
    }
    if (props.formikProps?.values?.delegateType) {
      const val = { type: props.formikProps?.values?.delegateType, value: '', icon: '' }
      state.setSelectedDelegate(val)
    }
    if (props.formikProps.values?.delegateType) {
      state.setInClusterDelegate(DelegateInClusterType.useExistingDelegate)
    }
  }, [props])

  return (
    <div className={css.formCustomCss}>
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
      {state.selectedDelegate?.type === DelegateTypes.DELEGATE_IN_CLUSTER && !loading
        ? renderDelegateInclusterForm(state, delegateList as RestResponseListString)
        : null}
      {state.selectedDelegate?.type === DelegateTypes.DELEGATE_OUT_CLUSTER
        ? renderDelegateOutclusterForm(state, props)
        : null}
    </div>
  )
}

export default KubCluster
