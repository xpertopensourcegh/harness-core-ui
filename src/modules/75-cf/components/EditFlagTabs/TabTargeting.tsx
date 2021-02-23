import React, { useState, useEffect } from 'react'
import {
  Layout,
  Button,
  Text,
  Container,
  Formik,
  FormikForm as Form,
  FormInput,
  useModalHook
} from '@wings-software/uicore'
import { Dialog } from '@blueprintjs/core'
import type { Feature } from 'services/cf'
import CustomRulesView from './CustomRulesView'
import i18n from './Tabs.i18n'
import { DefaultRulesView } from './DefaultRulesView'

interface TabTargetingProps {
  formikProps: any
  editing: boolean
  refetch: any
  targetData: Feature
  isBooleanTypeFlag?: boolean
  projectIdentifier: string
  environmentIdentifier: string
  setEditing: Function
}

const TodoTargeting: React.FC<TabTargetingProps> = props => {
  const { formikProps, targetData, editing, setEditing, environmentIdentifier, projectIdentifier } = props
  const [isEditRulesOn, setEditRulesOn] = useState(false)

  useEffect(() => {
    if (!editing && isEditRulesOn) setEditRulesOn(false)
  }, [editing])

  const [, hideTargetModal] = useModalHook(() => (
    <Dialog onClose={hideTargetModal} title="" isOpen={true}>
      <Layout.Vertical>
        <Text>
          {i18n.tabTargeting.serve} {i18n.tabTargeting.following}:
        </Text>

        <Formik initialValues={{}} onSubmit={() => alert('To be implemented...')}>
          {() => (
            <Form>
              <FormInput.TextArea name="targets" />
            </Form>
          )}
        </Formik>

        <Layout.Horizontal>
          <Button intent="primary" text={i18n.save} onClick={() => alert('To be implemented...')} />
          <Button minimal text={i18n.cancel} onClick={hideTargetModal} />
        </Layout.Horizontal>
      </Layout.Vertical>
    </Dialog>
  ))

  const onEditBtnHandler = (): void => {
    setEditRulesOn(!isEditRulesOn)
    setEditing(true)
  }

  const showCustomRules =
    editing ||
    (targetData?.envProperties?.rules?.length || 0) > 0 ||
    (targetData?.envProperties?.variationMap?.length || 0) > 0

  return (
    <Layout.Vertical padding={{ left: 'huge', right: 'large', bottom: 'large' }}>
      <Container style={{ marginLeft: 'auto' }}>
        <Button
          text={i18n.tabTargeting.editRules}
          icon="edit"
          onClick={onEditBtnHandler}
          style={{
            visibility: isEditRulesOn ? 'hidden' : undefined
          }}
        />
      </Container>
      <Layout.Vertical>
        <DefaultRulesView
          formikProps={formikProps}
          editing={isEditRulesOn}
          defaultOnVariation={targetData.defaultOnVariation}
          bucketBy={targetData.envProperties?.defaultServe.distribution?.bucketBy}
          weightedVariations={targetData.envProperties?.defaultServe.distribution?.variations}
          variations={targetData.variations}
        />
      </Layout.Vertical>
      <Layout.Vertical>
        {showCustomRules && (
          <CustomRulesView
            editing={isEditRulesOn}
            formikProps={formikProps}
            target={targetData}
            enviroment={environmentIdentifier}
            project={projectIdentifier}
          />
        )}
      </Layout.Vertical>
    </Layout.Vertical>
  )
}

export default TodoTargeting
