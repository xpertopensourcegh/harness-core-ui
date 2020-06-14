import React from 'react'
import { FormInput } from '@wings-software/uikit'
import i18n from './KubCluster.i18n'
import { Card, Layout } from '@wings-software/uikit'
// interface KubClusterProps{
//   onSubmit: () => void
// }
const KubCluster = () => {
  return (
    <>
      <FormInput.Text label={i18n.displayName} name="name" />
      <FormInput.TextArea label={i18n.description} name="description" />
      <FormInput.Text label={i18n.identifier} name="identifier" />
      <Layout.Horizontal spacing="large">
        <Card interactive={true}>HARNESS DELEGATE RUNNING IN CLUSTER</Card>
        <Card interactive={true}>HARNESS DELEGATE RUNNING OUT OF CLUSTER</Card>
      </Layout.Horizontal>
      {/* <FormInput.RadioGroup label={i18n.selectDealegate} name='select-delegate'/> */}
    </>
  )
}

export default KubCluster
