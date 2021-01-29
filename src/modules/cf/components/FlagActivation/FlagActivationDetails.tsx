import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { get, isEqual, zip, flatMap, cloneDeep, orderBy } from 'lodash-es'
import {
  Color,
  Layout,
  Text,
  FlexExpander,
  Button,
  Container,
  Popover,
  Icon,
  Heading,
  Collapse,
  Formik,
  FormikForm as Form,
  FormInput,
  useModalHook,
  SelectOption
} from '@wings-software/uicore'
import moment from 'moment'
import { FieldArray } from 'formik'
import { Menu, Dialog, Classes } from '@blueprintjs/core'
import type { IconName } from '@blueprintjs/core'
import { useToaster } from '@common/exports'
import { Feature, Features, Prerequisite, usePatchFeature, Variation } from 'services/cf'
import { FlagTypeVariations } from '../CreateFlagDialog/FlagDialogUtils'
import InputDescOptional from '../CreateFlagWizard/common/InputDescOptional'
import patch from '../../utils/instructions'
import i18n from './FlagActivationDetails.i18n'
import css from './FlagActivationDetails.module.scss'

const editCardCollapsedProps = {
  collapsedIcon: 'main-chevron-right' as IconName,
  expandedIcon: 'main-chevron-down' as IconName,
  isOpen: false,
  isRemovable: false,
  className: 'collapse'
}

interface FlagActivationDetailsProps {
  featureFlag: Feature
  featureList: Features | null
  refetchFlag: () => void
}

interface PrerequisiteEntry {
  feature: string
  variation: string
}

const VariationItem: React.FC<{ variation: Variation }> = ({ variation }) => {
  const { name, value, description } = variation

  return (
    <Container className={css.variationItem}>
      <Text margin={{ bottom: 'xsmall' }}>{name || value}</Text>
      {description && <Text font={{ size: 'small' }}>{description}</Text>}
    </Container>
  )
}

const VariationsList: React.FC<{ featureFlag: Feature; onEditVariations: () => void }> = ({
  featureFlag,
  onEditVariations
}) => {
  const isFlagTypeBoolean = featureFlag?.kind === FlagTypeVariations.booleanFlag
  const { variations } = featureFlag

  return (
    <Layout.Vertical padding="large" margin={{ top: 'large' }} style={{ boxShadow: '0 0 10px #ccc' }}>
      <Layout.Horizontal flex={{ align: 'center-center' }} margin={{ bottom: 'medium' }}>
        <Text color={Color.BLACK} font={{ size: 'medium', weight: 'bold' }}>
          {i18n.variations}
        </Text>
        <FlexExpander />
        <Button minimal intent="primary" icon="edit" onClick={onEditVariations} />
      </Layout.Horizontal>

      <Layout.Vertical className={css.variationsList}>
        <Text
          border={{ bottom: true, color: Color.GREY_300 }}
          padding={{ bottom: 'small' }}
          style={{ fontSize: '14px', lineHeight: '20px' }}
        >
          {isFlagTypeBoolean ? i18n.boolean : i18n.multivariate} ({variations.length}{' '}
          {i18n.variations.toLocaleLowerCase()})
        </Text>
        {featureFlag.variations.map(variation => (
          <VariationItem key={variation.identifier} variation={variation} />
        ))}
      </Layout.Vertical>
    </Layout.Vertical>
  )
}

const FlagActivationDetails: React.FC<FlagActivationDetailsProps> = props => {
  const { featureList, featureFlag, refetchFlag } = props
  const { showError } = useToaster()
  const [editOpenedMenu, setEditOpenedMenu] = useState(false)
  const { orgIdentifier, accountId } = useParams<Record<string, string>>()
  const [editDefaultValuesModal, setEditDefaultValuesModal] = useState<SelectOption[]>([])
  const [isEditingPrerequisites, setEditingPrerequisites] = useState<boolean>(false)

  const { mutate: submitPatch } = usePatchFeature({
    identifier: featureFlag?.identifier as string,
    queryParams: {
      project: featureFlag?.project as string,
      environment: featureFlag?.envProperties?.environment as string,
      account: accountId,
      org: orgIdentifier
    }
  })

  const history = useHistory()

  const isBooleanFlag = featureFlag?.kind === FlagTypeVariations.booleanFlag

  const setDefaultFlags = (): void => {
    let localVars: SelectOption[] = []
    if (featureFlag?.variations.length) {
      // FIXME: Check the TS error about incompatible types
      localVars = featureFlag?.variations.map(elem => {
        return { label: elem.identifier as string, value: elem.value as any }
      })
    }
    setEditDefaultValuesModal(localVars)
  }
  const initialVariations = cloneDeep(featureFlag?.variations)

  const handlePrerequisiteInteraction = (action: 'edit' | 'delete', prereq: Prerequisite) => () => {
    if (action === 'delete') {
      patch.feature.addInstruction(patch.creators.removePrerequisite(prereq.feature))
      patch.feature.onPatchAvailable(data => {
        submitPatch(data)
          .then(refetchFlag)
          .catch(err => {
            showError(get(err, 'data.message', err?.message))
          })
          .finally(patch.feature.reset)
      })
    } else {
      setEditingPrerequisites(true)
      openModalPrerequisites()
    }
  }

  const [openModalEditVariations, hideModalEditVariations] = useModalHook(() => {
    const initialValues = {
      variations: featureFlag?.variations,
      defaultOnVariation: featureFlag?.defaultOnVariation,
      defaultOffVariation: featureFlag?.defaultOffVariation
    }

    const [initValues, setInitialValues] = useState(initialValues) // eslint-disable-line

    const handleSubmit = (values: typeof initialValues): void => {
      const { defaultOffVariation, defaultOnVariation } = values
      let { variations } = values

      variations = variations.map((variation: Variation) => {
        variation['identifier'] = variation?.value
        return variation
      })

      if (!isEqual(variations, initialVariations) && initialVariations.length > variations.length) {
        const _variations = orderBy(variations, 'name', 'asc')
        const _initialVariations = orderBy(initialVariations, 'name', 'asc')
        const _missing = _initialVariations.map(initial => {
          const isVariantAvailable = _variations.filter(el => el.identifier === initial.identifier)
          if (isVariantAvailable && isVariantAvailable.length === 0) {
            return initial?.identifier
          }
        })

        patch.feature.addAllInstructions(_missing.filter(x => x !== undefined).map(patch.creators.deleteVariant))
      }
      if (!isEqual(variations, initialVariations) && initialVariations.length < variations.length) {
        patch.feature.addAllInstructions(
          zip(variations, initialVariations)
            .filter(([cur, prev]) => !isEqual(cur, prev))
            .map(tuple => tuple[0] as NonNullable<Variation>)
            .map(patch.creators.addVariation)
        )
      }
      if (!isEqual(variations, initialVariations) && initialVariations.length === variations.length) {
        patch.feature.addAllInstructions(
          zip(variations, initialVariations)
            .filter(([cur, prev]) => !isEqual(cur, prev))
            .map(tuple => tuple[0] as NonNullable<Variation>)
            .map(patch.creators.updateVariation)
        )
      }
      if (!isEqual(defaultOffVariation, initialValues.defaultOffVariation)) {
        patch.feature.addInstruction(patch.creators.setDefaultOffVariation(defaultOffVariation as string))
      }
      if (!isEqual(defaultOnVariation, initialValues.defaultOnVariation)) {
        patch.feature.addInstruction(patch.creators.setDefaultOnVariation(defaultOnVariation as string))
      }

      patch.feature
        .onPatchAvailable(data => {
          submitPatch(data)
            .then(() => {
              patch.feature.reset()
              refetchFlag()
              hideModalEditVariations()
            })
            .catch(() => {
              patch.feature.reset()
            })
        })
        .onEmptyPatch(hideModalEditVariations)
    }

    return (
      <Dialog onClose={hideModalEditVariations} title={''} isOpen={true} style={{ width: '800px' }}>
        <Layout.Vertical padding={{ left: 'xlarge', right: 'large' }}>
          <Heading level={2} font={{ weight: 'bold' }} margin={{ bottom: 'medium' }}>
            {i18n.editVariations.editVariationHeading}
          </Heading>
          <Container>
            <Formik initialValues={initValues} onSubmit={handleSubmit} enableReinitialize={true}>
              {formikProps => (
                <Form>
                  <Layout.Vertical>
                    <Container>
                      {isBooleanFlag ? (
                        <>
                          <Layout.Horizontal className={css.variationsContainer}>
                            <FormInput.Text name="variations[0].identifier" label={i18n.editVariations.true} />
                            <InputDescOptional
                              text={i18n.descOptional}
                              inputName="variations[0].description"
                              inputPlaceholder={''}
                              isOpen={featureFlag?.variations[0].description ? true : false}
                            />
                          </Layout.Horizontal>
                          <Layout.Horizontal className={css.variationsContainer}>
                            <FormInput.Text name="variations[1].identifier" label={i18n.editVariations.false} />
                            <InputDescOptional
                              text={i18n.descOptional}
                              inputName="variations[1].description"
                              inputPlaceholder={''}
                              isOpen={featureFlag?.variations[1].description ? true : false}
                            />
                          </Layout.Horizontal>
                        </>
                      ) : (
                        formikProps?.values?.variations?.map((elem, index) => (
                          <Layout.Horizontal
                            key={`${elem.identifier}-${index}`}
                            style={{ alignItems: 'center' }}
                            spacing="large"
                          >
                            <FormInput.Text
                              name={`variations.${index}.value`}
                              label={`${i18n.variation} ${index + 1}`}
                              style={{ marginRight: 'var(--spacing-small)' }}
                            />
                            <FormInput.Text
                              name={`variations.${index}.name`}
                              label={i18n.nameLabelOptional}
                              placeholder={i18n.nameLabel}
                              style={{ marginRight: 'var(--spacing-small)' }}
                            />
                            <InputDescOptional
                              text={i18n.descOptional}
                              inputName={`variations?.${index}?.description`}
                              inputPlaceholder={i18n.editVariations.variationAbout}
                              isOpen={featureFlag?.variations[index]?.description ? true : false}
                            />
                            <Icon
                              name="trash"
                              color={Color.GREY_400}
                              onClick={() => {
                                const _variations = initValues.variations
                                _variations.splice(index, 1)
                                setInitialValues(oldVal => {
                                  const obj = {
                                    ...oldVal,
                                    variations: _variations
                                  }
                                  return obj
                                })
                              }}
                              size={14}
                              style={{ cursor: 'pointer' }}
                            />
                          </Layout.Horizontal>
                        ))
                      )}
                      {!isBooleanFlag && (
                        <Layout.Horizontal>
                          <Text
                            color={Color.BLUE_500}
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              const newVariation = { description: '', identifier: '', name: '', value: '' } as Variation
                              // initialValues.variations.push(newVariation)
                              setInitialValues(oldVal => {
                                const obj = {
                                  ...oldVal,
                                  variations: [...oldVal.variations, newVariation]
                                }
                                return obj
                              })
                            }}
                          >
                            {i18n.editVariations.addVariation}
                          </Text>
                        </Layout.Horizontal>
                      )}
                    </Container>

                    <Container>
                      <Layout.Vertical margin={{ top: 'xlarge' }}>
                        <Layout.Horizontal>
                          <Text
                            font={{ weight: 'bold' }}
                            color={Color.BLACK}
                            margin={{ right: 'xsmall' }}
                            // rightIcon="info-sign"
                            // rightIconProps={{ size: 10, color: Color.BLUE_500 }}
                            // tooltip="To be added..."
                            tooltipProps={{ isDark: true }}
                          >
                            {i18n.editVariations.defaultRules}
                          </Text>
                        </Layout.Horizontal>

                        <Text margin={{ bottom: 'large' }}>{i18n.editVariations.defaultRulesDesc}</Text>

                        <Layout.Horizontal className={css.newEnvRulesContainer}>
                          <Text margin={{ right: 'medium' }} width="150px">
                            {i18n.editVariations.defaultFlagOn}
                          </Text>
                          <FormInput.Select
                            name="defaultOnVariation"
                            items={editDefaultValuesModal}
                            className={css.selectEnv}
                          />
                        </Layout.Horizontal>

                        <Layout.Horizontal className={css.newEnvRulesContainer}>
                          <Text margin={{ right: 'medium' }} width="150px">
                            {i18n.editVariations.defaultFlagOff}
                          </Text>
                          <FormInput.Select
                            name="defaultOffVariation"
                            items={editDefaultValuesModal}
                            className={css.selectEnv}
                          />
                        </Layout.Horizontal>
                      </Layout.Vertical>
                    </Container>
                    <Layout.Horizontal padding={{ top: 'large', bottom: 'large' }}>
                      <Button text={i18n.save} intent="primary" margin={{ right: 'small' }} type="submit" />
                      <Button onClick={hideModalEditVariations} text={i18n.cancel} />
                    </Layout.Horizontal>
                  </Layout.Vertical>
                </Form>
              )}
            </Formik>
          </Container>
        </Layout.Vertical>
      </Dialog>
    )
  }, [editDefaultValuesModal, featureFlag?.variations])

  const [openModalPrerequisites, hideModalPrerequisites] = useModalHook(() => {
    const initialPrereqValues = {
      prerequisites: flatMap(featureFlag.prerequisites, ({ feature, variations }) => {
        return variations.map(variation => ({ variation, feature } as PrerequisiteEntry))
      })
    }

    const handleAddPrerequisite = (prereqValues: typeof initialPrereqValues) => {
      const validPreqs = prereqValues.prerequisites
        .reduce((acc, next) => {
          const prIndex = acc.findIndex(p => p.feature === next.feature)
          if (prIndex === -1) {
            acc.push({ feature: next.feature, variations: [next.variation] })
          } else {
            acc[prIndex].variations.push(next.variation)
          }
          return acc
        }, [] as Prerequisite[])
        .filter(({ feature, variations }) => Boolean(feature.length && variations.filter(x => x.length).length))
      const prerequisites = validPreqs
        .reduce((acc, prereq) => {
          const { feature, variations } = prereq
          const exists = acc.find(p => p.feature === feature)
          if (exists) {
            exists.variations = exists.variations.concat(variations)
            return acc
          } else {
            return [...acc, prereq]
          }
        }, [] as Prerequisite[])
        .map(p => ({ ...p, variations: p.variations.sort() } as Prerequisite))
        .sort((a, b) => a.feature.localeCompare(b.feature))

      const initialPrerequisites = featureFlag.prerequisites || []
      const removedPrerequisites = initialPrerequisites.filter(pr => !prerequisites.find(p => pr.feature === p.feature))
      const newPrerequisites = prerequisites.filter(p => !initialPrerequisites.find(pr => pr.feature === p.feature))
      const updatedPrequisites = prerequisites.filter(p =>
        initialPrerequisites.find(pr => pr.feature === p.feature && !isEqual(pr.variations, p.variations))
      )

      const instructions = [
        ...removedPrerequisites.map(p => patch.creators.removePrerequisite(p.feature)),
        ...newPrerequisites.map(patch.creators.addPrerequisite),
        ...updatedPrequisites.map(patch.creators.updatePrequisite)
      ]

      patch.feature.addAllInstructions(instructions)
      patch.feature
        .onPatchAvailable(data => {
          submitPatch(data)
            .then(() => {
              hideModalPrerequisites()
              refetchFlag()
            })
            .catch(err => {
              showError(get(err, 'data.message', err?.message))
            })
            .finally(() => {
              patch.feature.reset()
            })
        })
        .onEmptyPatch(hideModalPrerequisites)
    }

    const title = isEditingPrerequisites
      ? i18n.addPrerequisites.editPrerequisitesHeading
      : i18n.addPrerequisites.addPrerequisitesHeading

    return (
      <Dialog title={title} onClose={hideModalPrerequisites} isOpen={true}>
        <Layout.Vertical padding={{ left: 'large', right: 'medium' }}>
          <Text margin={{ top: 'medium', bottom: 'xlarge' }}>{i18n.addPrerequisites.addPrerequisitesDesc}</Text>
          <Formik initialValues={initialPrereqValues} onSubmit={handleAddPrerequisite}>
            {formikProps => (
              <Form>
                <FieldArray name="prerequisites">
                  {arrayHelpers => {
                    return (
                      <>
                        {formikProps.values.prerequisites.map((elem, i) => {
                          return (
                            <Layout.Horizontal flex key={`prereq-${i}`}>
                              <FormInput.Select
                                name={`prerequisites.${i}.feature`}
                                placeholder={i18n.addPrerequisites.selectFlag}
                                items={
                                  featureList?.features?.map((flag: Feature) => ({
                                    label: flag.name,
                                    value: flag.identifier
                                  })) || []
                                }
                              />
                              <FormInput.Select
                                name={`prerequisites.${i}.variation`}
                                placeholder={i18n.addPrerequisites.selectVariation}
                                items={
                                  featureList?.features
                                    ?.find(ff => ff.identifier === elem.feature)
                                    ?.variations?.map((v: Variation) => ({
                                      label: v.name?.length ? v.name : v.identifier,
                                      value: v.identifier
                                    })) || []
                                }
                              />
                            </Layout.Horizontal>
                          )
                        })}
                        <Button
                          minimal
                          intent="primary"
                          text={i18n.prerequisites}
                          icon="small-plus"
                          onClick={() => {
                            arrayHelpers.push({ feature: '', variations: [''] })
                          }}
                        />
                      </>
                    )
                  }}
                </FieldArray>
                <Layout.Horizontal padding={{ top: 'large', bottom: 'large' }} border={{ bottom: true }}>
                  <Button text={i18n.save} intent="primary" margin={{ right: 'small' }} type="submit" />
                  <Button text={i18n.cancel} onClick={hideModalPrerequisites} />
                </Layout.Horizontal>
              </Form>
            )}
          </Formik>
        </Layout.Vertical>
      </Dialog>
    )
  }, [featureList, isEditingPrerequisites])

  const [openEditDetailsModal, hideEditDetailsModal] = useModalHook(() => {
    const initialValues = {
      name: featureFlag?.name,
      description: featureFlag?.description,
      tags: featureFlag?.tags?.map(elem => elem.name),
      permanent: featureFlag?.permanent
    }

    // TODO: Uncomment when tags are ready on Backend
    // const getTag = (tagName: string) => singleFlag?.tags?.find(tag => tag.name === tagName)

    const handleSubmit = (values: typeof initialValues): void => {
      const { name, description, tags, permanent } = values
      if (name !== initialValues.name) {
        patch.feature.addInstruction(patch.creators.updateName(name as string))
      }

      if (description !== initialValues.description) {
        patch.feature.addInstruction(patch.creators.updateDescription(description as string))
      }

      if (!isEqual(tags, initialValues.tags)) {
        // TODO: Uncomment when tags are ready on Backend
        // initialValues.tags
        //   ?.filter(tag => tags?.includes(tag))
        //   .map(getTag)
        //   .forEach((tag: any) => {
        //     patch.feature.addInstruction(patch.creators.removeTag(tag.name, tag.value))
        //   })
        // tags
        //   ?.filter((tag: any) => !initialValues.tags?.includes(tag))
        //   .forEach((tag: any) => {
        //     console.log(tag)
        //     patch.feature.addInstruction(patch.creators.addTag(tag, tag))
        //   })
      }

      if (permanent !== initialValues.permanent) {
        // TODO: not implemented on backend yet
      }

      patch.feature
        .onPatchAvailable(data => {
          submitPatch(data)
            .then(() => {
              patch.feature.reset()
              refetchFlag()
            })
            .catch(() => {
              patch.feature.reset()
            })
        })
        .onEmptyPatch(hideEditDetailsModal)
    }

    return (
      <Dialog onClose={hideEditDetailsModal} isOpen={true} title={''}>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {() => (
            <Form>
              <Layout.Vertical className={css.editDetailsModalContainer}>
                <Text>{i18n.editDetails.editDetailsHeading}</Text>

                <FormInput.Text name="name" label={i18n.nameLabel} />

                <FormInput.TextArea name="description" label={i18n.descOptional} />

                <FormInput.TagInput
                  name="tags"
                  label={i18n.editDetails.tags}
                  items={[]}
                  labelFor={nameTag => nameTag as string}
                  itemFromNewTag={newTag => newTag}
                  tagInputProps={{ showAddTagButton: true, allowNewTag: true }}
                />

                <Layout.Horizontal padding={{ top: 'medium', bottom: 'medium' }}>
                  <FormInput.CheckBox
                    name="permanent"
                    label={i18n.editDetails.permaFlag}
                    className={css.checkboxEditDetails}
                  />
                  {/* <Text
                    icon="info-sign"
                    iconProps={{ color: Color.BLUE_500, size: 12 }}
                    tooltip="To be added..."
                    tooltipProps={{ isDark: true }}
                  /> */}
                </Layout.Horizontal>

                <Layout.Horizontal>
                  <Button intent="primary" text={i18n.save} type="submit" />
                  <Button minimal text={i18n.cancel} onClick={hideEditDetailsModal} />
                </Layout.Horizontal>
              </Layout.Vertical>
            </Form>
          )}
        </Formik>
      </Dialog>
    )
  })

  return (
    <>
      <Layout.Horizontal>
        <Text color={Color.BLUE_500} onClick={() => history.goBack()} style={{ cursor: 'pointer' }}>
          {i18n.flag} /
        </Text>
        <FlexExpander />
        <span>
          <Icon name="pin" />
        </span>
        <Popover
          isOpen={editOpenedMenu}
          onInteraction={nextOpenState => {
            setEditOpenedMenu(nextOpenState)
          }}
          className={Classes.DARK}
        >
          <Button
            minimal
            icon="more"
            onClick={e => {
              e.stopPropagation()
              setEditOpenedMenu(true)
            }}
          />
          <Menu style={{ minWidth: 'unset' }}>
            <Menu.Item icon="edit" text={i18n.edit} onClick={openEditDetailsModal} />
            <Menu.Divider />
            <Menu.Item icon="archive" text={i18n.archive} onClick={() => alert('To be implemented...')} />
          </Menu>
        </Popover>
      </Layout.Horizontal>

      <Container>
        <Heading color={Color.BLACK} margin={{ bottom: 'medium' }}>
          {featureFlag?.name}
        </Heading>
        <Text margin={{ bottom: 'medium' }}>{featureFlag?.description}</Text>
        <Text font={{ size: 'small' }}>
          <span style={{ backgroundColor: 'var(--blue-300)', padding: 'var(--spacing-xsmall)', borderRadius: '7px' }}>
            {featureFlag?.identifier}
          </span>
        </Text>
        <Container className={css.tagsFlagActivationDetails}>
          {featureFlag?.tags?.map((elem, i) => (
            <Text
              key={`flagDetails-${i}`}
              background={Color.GREY_300}
              color={Color.GREY_800}
              margin={{ right: 'xsmall' }}
              padding={{ top: 'small', bottom: 'small', left: 'xsmall', right: 'xsmall' }}
            >
              {elem.value}
            </Text>
          ))}
        </Container>

        <Layout.Horizontal flex margin={{ top: 'medium' }}>
          <Layout.Vertical>
            <Layout.Horizontal flex>
              <Text color={Color.BLACK} font={{ weight: 'bold' }} margin={{ right: 'xsmall' }}>
                {i18n.created}
              </Text>
              <Text font={{ size: 'small' }} color={Color.GREY_400}>
                {moment(featureFlag?.createdAt).format('MMMM D, YYYY hh:mm A')}
              </Text>
            </Layout.Horizontal>
            <Layout.Horizontal flex>
              <Text color={Color.BLACK} font={{ weight: 'bold' }} margin={{ right: 'xsmall' }}>
                {i18n.modified}
              </Text>
              <Text font={{ size: 'small' }} color={Color.GREY_400}>
                {moment(featureFlag?.modifiedAt).format('MMMM D, YYYY hh:mm A')}
              </Text>
            </Layout.Horizontal>
          </Layout.Vertical>
          <FlexExpander />
          <Layout.Vertical>
            <Layout.Horizontal>
              <Icon name="user" />
              <Icon name="plus" />
            </Layout.Horizontal>
          </Layout.Vertical>
        </Layout.Horizontal>

        <VariationsList
          featureFlag={featureFlag}
          onEditVariations={() => {
            openModalEditVariations()
            setDefaultFlags()
          }}
        />

        <Container className={css.collapseFeatures}>
          <Collapse {...editCardCollapsedProps} heading={i18n.prerequisitesWithDesc}>
            <Layout.Horizontal flex margin={{ bottom: 'xsmall' }}>
              <Text width="50%">{i18n.flag}</Text>
              <Text width="50%">{i18n.variation}</Text>
            </Layout.Horizontal>
            <Layout.Vertical className={css.collapseFeaturesPrerequisites}>
              {Boolean(featureFlag.prerequisites?.length) &&
                featureFlag.prerequisites?.map((elem, i) => (
                  <Layout.Horizontal key={i} flex padding="medium">
                    <Text>{elem.feature}</Text>
                    <Text>{elem.variations[0]}</Text>
                    <Button
                      minimal
                      icon="Options"
                      iconProps={{ size: 24 }}
                      style={{ marginLeft: 'auto' }}
                      tooltip={
                        <Menu style={{ minWidth: 'unset' }}>
                          <Menu.Item
                            icon="edit"
                            text={i18n.edit}
                            onClick={handlePrerequisiteInteraction('edit', elem)}
                          />
                          <Menu.Item
                            icon="cross"
                            text={i18n.delete}
                            onClick={handlePrerequisiteInteraction('delete', elem)}
                          />
                        </Menu>
                      }
                      tooltipProps={{ isDark: true, interactionKind: 'click' }}
                    />
                  </Layout.Horizontal>
                ))}
              <Button
                minimal
                intent="primary"
                icon="small-plus"
                text={i18n.prerequisites}
                onClick={() => {
                  setEditingPrerequisites(false)
                  openModalPrerequisites()
                }}
              />
            </Layout.Vertical>
          </Collapse>
        </Container>

        <Container className={css.collapseFeatures}>
          <Collapse {...editCardCollapsedProps} heading={i18n.workflowsWithDesc}>
            <Text>To be implemented...</Text>
          </Collapse>
        </Container>
      </Container>
    </>
  )
}

export default FlagActivationDetails
