import React, { useState } from 'react'
import {
  Color,
  Layout,
  Button,
  Text,
  Container,
  Formik,
  FormikForm as Form,
  FormInput,
  useModalHook
} from '@wings-software/uikit'
import { FieldArray } from 'formik'
import cx from 'classnames'
import { Dialog } from '@blueprintjs/core'
import type { FeatureFlagActivation, Variation } from 'services/cf'
import i18n from './Tabs.i18n'
import css from './TabTargeting.module.scss'

interface TabTargetingProps {
  targetData: FeatureFlagActivation | undefined
  defaultOnVariation: string | undefined
  defaultOffVariation: string | undefined
  variations: Variation[] | undefined
  isBooleanTypeFlag?: boolean
}

const TodoTargeting: React.FC<TabTargetingProps> = props => {
  const { defaultOnVariation, defaultOffVariation, isBooleanTypeFlag } = props

  const [isEditOn, setIsEditOn] = useState(false)
  const [isServeTargetOn, setIsServeTargetOn] = useState(false)

  const [onOpenTargetModal, hideTargetModal] = useModalHook(() => (
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
    setIsEditOn(!isEditOn)
  }

  const onCancelEditHandler = (): void => {
    setIsEditOn(false)
    setIsServeTargetOn(false)
    setIsServeTargetOn(false)
  }
  const onServeTarget = (): void => {
    setIsServeTargetOn(true)
  }

  return (
    <>
      <Layout.Vertical>
        <Container style={{ marginLeft: 'auto' }}>
          {!isEditOn && <Button text={i18n.tabTargeting.editRules} icon="edit" onClick={onEditBtnHandler} />}
        </Container>
        <Layout.Vertical>
          <Text
            font={{ weight: 'bold' }}
            color={Color.BLACK}
            margin={{ bottom: 'medium' }}
            className={cx(isEditOn && css.defaultRulesHeadingMt)}
          >
            {i18n.defaultRules}
          </Text>
          {isEditOn ? (
            // Show components when we are IN editing
            <Container className={css.editContainer}>
              <Formik
                initialValues={{
                  variationsTargets: [{ name: '', targets: [] as string[] }],
                  variationRequest: [],
                  variationRequestInner: []
                }}
                onSubmit={vals => {
                  alert(JSON.stringify(vals, null, 2))
                }}
              >
                {formikProps => (
                  <Form>
                    <Container>
                      {/* TODO: Work in progress */}
                      {isBooleanTypeFlag ? (
                        <>
                          <Layout.Horizontal style={{ alignItems: 'baseline' }}>
                            <Text width="150px">{i18n.tabTargeting.flagOn}</Text>
                            <FormInput.Select name="1" items={[{ label: 'trueBoolean', value: 'trueBoolean' }]} />
                          </Layout.Horizontal>
                          <Layout.Horizontal style={{ alignItems: 'baseline' }}>
                            <Text width="150px">{i18n.tabTargeting.flagOff}</Text>
                            <FormInput.Select name="2" items={[{ label: 'falseBoolean', value: 'falseBoolean' }]} />
                          </Layout.Horizontal>
                        </>
                      ) : (
                        <>
                          <Layout.Horizontal style={{ alignItems: 'baseline' }}>
                            <Text width="150px">{i18n.tabTargeting.flagOn}</Text>
                            <FormInput.Select name="3" items={[{ label: 'multi', value: 'multi' }]} />
                          </Layout.Horizontal>
                          <Layout.Horizontal style={{ alignItems: 'baseline' }}>
                            <Text width="150px">{i18n.tabTargeting.flagOff}</Text>
                            <FormInput.Select name="4" items={[{ label: 'multi', value: 'multi' }]} />
                          </Layout.Horizontal>
                        </>
                      )}
                    </Container>

                    <Container>
                      <Text font={{ weight: 'bold' }} color={Color.BLACK} margin={{ bottom: 'large', top: 'large' }}>
                        {i18n.tabTargeting.customRules}
                      </Text>

                      <Layout.Vertical style={{ padding: '1px' }}>
                        <Container margin={{ bottom: 'small' }}>
                          {isServeTargetOn ? (
                            <Container className={css.editServeVariationTargetContainer}>
                              <Text margin={{ bottom: 'medium' }} color={Color.BLACK}>
                                {i18n.tabTargeting.serveVariationToTarget}
                              </Text>
                              <FieldArray name="variationsTargets">
                                {arrayProps => {
                                  return (
                                    <>
                                      {formikProps?.values?.variationsTargets.map((elem, index) => (
                                        <Layout.Horizontal
                                          key={`serve-${index}`}
                                          className={css.editCustomRuleTargetContainer}
                                        >
                                          <Container>
                                            <Text>{i18n.tabTargeting.serve}</Text>

                                            {/* FIXME: Should fix items array from BE */}
                                            <FormInput.Select
                                              name={`variationsTargets.${index}.name`}
                                              items={[{ label: '1', value: '1' }]}
                                            />

                                            <Text margin={{ right: 'small' }}>{i18n.tabTargeting.toTarget}</Text>

                                            {elem.targets.map((elemT, indexT, arr) => (
                                              <Layout.Horizontal key={`target-${indexT}`} margin={{ right: 'small' }}>
                                                <Text>{elemT}</Text>
                                                <Text>
                                                  {arr.length} {i18n.total}
                                                </Text>
                                              </Layout.Horizontal>
                                            ))}

                                            <Button
                                              icon="add"
                                              iconProps={{ size: 20 }}
                                              minimal
                                              intent="primary"
                                              onClick={onOpenTargetModal}
                                              margin={{ right: 'small' }}
                                            />

                                            {/* TODO: Here we should add Popover component */}
                                            <Text icon="more" />
                                          </Container>

                                          <Button
                                            icon="trash"
                                            iconProps={{ size: 20 }}
                                            minimal
                                            onClick={() => {
                                              arrayProps.remove(index)
                                            }}
                                            className={css.editCustomRuleDeleteBtn}
                                          />
                                        </Layout.Horizontal>
                                      ))}
                                      <Button
                                        minimal
                                        intent="primary"
                                        icon="small-plus"
                                        text={i18n.tabTargeting.add}
                                        onClick={() => {
                                          arrayProps.push({ name: '', targets: [] as string[] })
                                        }}
                                      />
                                    </>
                                  )
                                }}
                              </FieldArray>
                            </Container>
                          ) : null}
                          {!isServeTargetOn && (
                            <Button
                              text={i18n.tabTargeting.serveVariationToTarget}
                              intent="primary"
                              minimal
                              icon="small-plus"
                              onClick={onServeTarget}
                            />
                          )}
                        </Container>

                        <Container>
                          {/* Outer formik array - on request */}
                          <FieldArray name="variationRequest">
                            {arrayProps => {
                              return (
                                <>
                                  {formikProps?.values?.variationRequest.map((_, index) => (
                                    <Layout.Vertical key={index} className={css.requestContainerWrapper}>
                                      <Layout.Vertical margin={{ bottom: 'small' }}>
                                        <Layout.Horizontal className={css.requestContainer}>
                                          <Container>
                                            <Text>{i18n.tabTargeting.onRequest}</Text>

                                            <FormInput.Select name="TODO_1" items={[{ label: '2', value: '2' }]} />

                                            <FormInput.Select name="TODO_2" items={[{ label: '2', value: '2' }]} />

                                            <FormInput.Select name="TODO_3" items={[{ label: '2', value: '2' }]} />
                                          </Container>

                                          <Button
                                            icon="trash"
                                            iconProps={{ size: 20 }}
                                            minimal
                                            onClick={() => {
                                              arrayProps.remove(index)
                                            }}
                                          />
                                        </Layout.Horizontal>

                                        {/* Inner formik array - on request serve */}
                                        <Container>
                                          <FieldArray name="variationRequestInner">
                                            {arrayPropsInner => {
                                              return (
                                                <>
                                                  {formikProps?.values?.variationRequestInner.map(
                                                    (_Inner, indexInner) => (
                                                      <Layout.Horizontal
                                                        key={`inner-${indexInner}`}
                                                        className={css.requestInnerContainer}
                                                      >
                                                        <Text>{i18n.and.toLowerCase()}</Text>

                                                        <FormInput.Select
                                                          name="TODO_4"
                                                          items={[{ label: '2', value: '2' }]}
                                                          style={{ marginRight: 'var(--spacing-small)' }}
                                                        />

                                                        <FormInput.Select
                                                          name="TODO_5"
                                                          items={[{ label: '2', value: '2' }]}
                                                          style={{ marginRight: 'var(--spacing-small)' }}
                                                        />

                                                        <FormInput.Select
                                                          name="TODO_6"
                                                          items={[{ label: '2', value: '2' }]}
                                                        />

                                                        <Button
                                                          icon="minus"
                                                          iconProps={{ color: Color.ORANGE_400 }}
                                                          minimal
                                                          onClick={() => {
                                                            arrayPropsInner.remove(index)
                                                          }}
                                                        />
                                                      </Layout.Horizontal>
                                                    )
                                                  )}

                                                  <Button
                                                    intent="primary"
                                                    minimal
                                                    icon="add"
                                                    iconProps={{ color: Color.BLUE_500 }}
                                                    onClick={() => {
                                                      arrayPropsInner.push({})
                                                    }}
                                                  />
                                                </>
                                              )
                                            }}
                                          </FieldArray>
                                        </Container>
                                      </Layout.Vertical>

                                      <Layout.Horizontal className={css.requestServeContainer}>
                                        <Text>{i18n.tabTargeting.serve.toLowerCase()}</Text>

                                        <FormInput.Select name="" items={[{ label: '2', value: '2' }]} />
                                      </Layout.Horizontal>
                                    </Layout.Vertical>
                                  ))}
                                  <Button
                                    text={i18n.tabTargeting.onRequestVariation}
                                    intent="primary"
                                    minimal
                                    icon="small-plus"
                                    onClick={() => {
                                      arrayProps.push({})
                                    }}
                                    margin={{ top: 'small' }}
                                  />
                                </>
                              )
                            }}
                          </FieldArray>
                        </Container>
                      </Layout.Vertical>
                    </Container>
                  </Form>
                )}
              </Formik>
              <Layout.Horizontal className={css.editBtnsGroup}>
                <Button
                  intent="primary"
                  text={i18n.saveChange}
                  margin={{ right: 'small' }}
                  onClick={() => alert('To be implemented...')}
                />
                <Button minimal text={i18n.cancel} onClick={onCancelEditHandler} />
              </Layout.Horizontal>
            </Container>
          ) : (
            // Show components when we are NOT in editing
            <Layout.Vertical>
              <Container className={css.defaultRulesContainer}>
                <Layout.Horizontal margin={{ bottom: 'medium' }}>
                  <Text width="150px">{i18n.tabTargeting.flagOn}</Text>
                  <Text>{defaultOnVariation}</Text>
                </Layout.Horizontal>

                <Layout.Horizontal>
                  <Text width="150px">{i18n.tabTargeting.flagOn}</Text>
                  <Text>{defaultOffVariation}</Text>
                </Layout.Horizontal>
              </Container>

              {/* TODO: When there is some data for custom rules, show them below */}
              {/* <Text color={Color.BLACK} font={{ weight: 'bold' }} margin={{ bottom: 'large' }}>
                {i18n.tabTargeting.customRules}
              </Text>

              <Container></Container>

              <Container></Container> */}
            </Layout.Vertical>
          )}
        </Layout.Vertical>
      </Layout.Vertical>
    </>
  )
}

export default TodoTargeting
