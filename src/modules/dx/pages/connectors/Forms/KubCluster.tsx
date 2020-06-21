import React, { useState } from 'react'
import { FormInput, Layout } from '@wings-software/uikit'
import i18n from './KubCluster.i18n'
import { RadioSelect, Select } from '@wings-software/uikit'
import css from './KubCluster.module.scss'
import { authOptions, getCustomFields } from './KubeFormHelper'
import cx from 'classnames'
// import type { AuthOption } from './KubeFormHelper'

interface SelectedDelegate {
  type: string
  value: string
  icon: string
}
interface KubClusterProps {
  enableEdit?: boolean
  connector: any
  enableCreate:boolean
}

interface KubClusterState {
  selectedDelegate: SelectedDelegate
  setSelectedDelegate: (val: SelectedDelegate) => void
  authentication: string
  setAuthentication: (val: string) => void
  inclusterDelegate: string
  setInClusterDelegate: (val: string) => void
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
      {/* <FormInput.RadioGroup
        name={'useexistingDelegate'}
        items={getDelegateInclusterData()}
        onChange={val => {
          console.log(val)
         state.setInClusterDelegate('useexistingDelegate')
        }}
      /> */}
      <div 
      className={css.radioOption}
       onClick={() => {
          state.setInClusterDelegate('useexistingDelegate')
        }}>
      <input
        type="radio"
        checked={state.inclusterDelegate === 'useexistingDelegate'}
       
      />
      <span className={css.label}>Use an existing Delegate</span>
      </div>
      {state.inclusterDelegate==='useexistingDelegate'?selectExistingDelegate():null}
      <div  onClick={() => {
          state.setInClusterDelegate('newDelegate')
        }}>
      <input
        type="radio"
        checked={state.inclusterDelegate === 'newDelegate'}
         disabled
      />
      <span className={css.label}>Add a new Delegate to this Cluster</span>
      </div>

      {/*TODO <RadioGroup
              name="existingDelegate"
              selectedValue={state.inclusterDelegate}
              onChange={(e: FormEvent<HTMLInputElement>) => {
                formikProps.setFieldValue('envType', e.currentTarget.value)
              }}
            >
              <Radio label="Use an existing Delegate"  value='useexistingDelegate' />
              <Radio label="Add a new Delegate to this Cluster"  value='newDelegate'/>
            </RadioGroup> */}

     
    </div>
  )
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
  const [inclusterDelegate, setInClusterDelegate] = useState('')
  const { connector } = props
  console.log(connector)
  const state: KubClusterState = {
    selectedDelegate,
    setSelectedDelegate,
    authentication,
    setAuthentication,
    inclusterDelegate,
    setInClusterDelegate
  }
  const radioProps = {
    data: delegateData,
    className: css.delegateSetup,
    renderItem: function renderItem(item: any) {
      return <div className={cx(css.cardCss,{[css.selectedCard]:item===selectedDelegate})}>{item.value}</div>
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
      {state.selectedDelegate?.type === DelegateTypes.DELEGATE_IN_CLUSTER ? renderDelegateInclusterForm(state) : null}
      {state.selectedDelegate?.type === DelegateTypes.DELEGATE_OUT_CLUSTER ? renderDelegateOutclusterForm(state) : null}
    </>
  )
}

export default KubCluster
