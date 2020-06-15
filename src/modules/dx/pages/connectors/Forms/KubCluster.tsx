import React from 'react'
import { FormInput } from '@wings-software/uikit'
import i18n from './KubCluster.i18n'
import { Card, Layout } from '@wings-software/uikit'
import type { ConnectorSchema } from '../ConnectorSchema'

interface KubClusterProps {
  enableEdit: boolean
  connector: ConnectorSchema
}
const KubCluster = (props: KubClusterProps): JSX.Element => {
  const { connector } = props

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
      <Layout.Horizontal spacing="large">
        <Card interactive={true}>
          <Layout.Horizontal spacing="medium">
            <span>HARNESS DELEGATE RUNNING IN CLUSTER</span>
            <FormInput.CheckBox name="delegate-in-cluster" label="" />
          </Layout.Horizontal>
        </Card>
        <Card interactive={true}>
          <Layout.Horizontal spacing="medium">
            <span>HARNESS DELEGATE RUNNING OUT OF CLUSTER</span>
            <FormInput.CheckBox name="delegate-out-cluster" label="" />
          </Layout.Horizontal>
        </Card>
      </Layout.Horizontal>
      {/* <FormInput.RadioGroup label={i18n.selectDealegate} name='select-delegate'/> */}
    </>
  )
}

export default KubCluster
