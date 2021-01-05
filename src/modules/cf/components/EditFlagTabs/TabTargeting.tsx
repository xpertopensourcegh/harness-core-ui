import React, { useState, useEffect } from 'react'
import {
  Color,
  Layout,
  Button,
  Text,
  Container,
  Formik,
  FormikForm as Form,
  FormInput,
  useModalHook,
  SelectOption
} from '@wings-software/uicore'
import cx from 'classnames'
import { Dialog } from '@blueprintjs/core'
import type { Distribution, WeightedVariation, Feature, Variation } from 'services/cf'
import PercentageRollout from './PercentageRollout'
import CustomRulesView from './CustomRulesView'
import i18n from './Tabs.i18n'
import css from './TabTargeting.module.scss'

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

  const showCustomRules = editing || (targetData?.envProperties?.rules?.length || 0) > 0

  return (
    <Layout.Vertical>
      <Container style={{ marginLeft: 'auto' }}>
        {!isEditRulesOn && <Button text={i18n.tabTargeting.editRules} icon="edit" onClick={onEditBtnHandler} />}
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

interface DefaultRulesProps {
  editing: boolean
  bucketBy?: string
  defaultOnVariation: string
  variations: Variation[]
  weightedVariations?: WeightedVariation[]
  formikProps: any
}

const DefaultRulesView: React.FC<DefaultRulesProps> = ({
  editing,
  bucketBy,
  variations,
  weightedVariations,
  formikProps
}) => {
  const [percentageView, setPercentageView] = useState<boolean>(false)

  const variationItems = variations.map<SelectOption>(elem => ({
    label: elem.name as string,
    value: elem.value as string
  }))

  const onDefaultONChange = (item: SelectOption) => {
    if (item.value === 'percentage') {
      setPercentageView(true)
    } else {
      setPercentageView(false)
    }
  }

  useEffect(() => {
    setPercentageView(formikProps.values.onVariation === 'percentage')
  }, [formikProps.values.onVariation])

  return (
    <>
      <Text
        font={{ weight: 'bold' }}
        color={Color.BLACK}
        margin={{ bottom: 'medium' }}
        className={cx(editing && css.defaultRulesHeadingMt)}
      >
        {i18n.defaultRules}
      </Text>
      <Container className={css.defaultRulesContainer}>
        <Layout.Horizontal margin={{ bottom: 'small' }} style={{ alignItems: 'baseline' }}>
          <Text width="150px">{i18n.tabTargeting.flagOn}</Text>
          <Container>
            {editing ? (
              <FormInput.Select
                name="onVariation"
                items={[
                  ...variationItems,
                  {
                    label: 'Percentage rollout',
                    value: 'percentage'
                  }
                ]}
                onChange={onDefaultONChange}
              />
            ) : (
              <Text className={cx(css.textUppercase, css.textBlack)}>{formikProps.values.onVariation}</Text>
            )}

            {percentageView && (
              <PercentageRollout
                editing={editing}
                bucketBy={bucketBy}
                variations={variations}
                weightedVariations={weightedVariations || []}
                onSetPercentageValues={(value: Distribution) => {
                  formikProps.setFieldValue('defaultServe', { distribution: value })
                }}
              />
            )}
          </Container>
        </Layout.Horizontal>

        <Layout.Horizontal style={{ alignItems: 'baseline' }}>
          <Text width="150px">{i18n.tabTargeting.flagOff}</Text>
          {editing ? (
            <FormInput.Select name="offVariation" items={variationItems} onChange={formikProps.handleChange} />
          ) : (
            <Text className={cx(css.textUppercase, css.textBlack)}>{formikProps.values.offVariation}</Text>
          )}
        </Layout.Horizontal>
      </Container>
    </>
  )
}
