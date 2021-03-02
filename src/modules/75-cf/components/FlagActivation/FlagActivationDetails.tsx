import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { get, isEqual, zip, flatMap, cloneDeep, orderBy } from 'lodash-es'
import { Link } from 'react-router-dom'
import {
  Color,
  Layout,
  Text,
  FlexExpander,
  Button,
  Container,
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
import cx from 'classnames'
import { Menu, Dialog, Intent } from '@blueprintjs/core'
import type { IconName } from '@blueprintjs/core'
import { useToaster } from '@common/exports'
import routes from '@common/RouteDefinitions'
import { useStrings } from 'framework/exports'
import { TagsViewer } from '@common/components/TagsViewer/TagsViewer'
import { Feature, Features, Prerequisite, useDeleteFeatureFlag, usePatchFeature, Variation } from 'services/cf'
import InputDescOptional from '@cf/components/CreateFlagWizard/common/InputDescOptional'
import { VariationWithIcon } from '@cf/components/VariationWithIcon/VariationWithIcon'
import { useConfirmAction } from '@common/hooks'
import { FlagTypeVariations } from '../CreateFlagDialog/FlagDialogUtils'
import patch from '../../utils/instructions'
import { VariationTypeIcon } from '../VariationTypeIcon/VariationTypeIcon'
import { IdentifierText } from '../IdentifierText/IdentifierText'
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

const VariationItem: React.FC<{ variation: Variation; index: number }> = ({ variation, index }) => {
  return (
    <Layout.Horizontal className={css.variationItem} spacing="xsmall" style={{ alignItems: 'center' }}>
      <VariationWithIcon variation={variation} index={index} />
    </Layout.Horizontal>
  )
}

const VariationsList: React.FC<{ featureFlag: Feature; onEditVariations: () => void }> = ({
  featureFlag,
  onEditVariations
}) => {
  const isFlagTypeBoolean = featureFlag.kind === FlagTypeVariations.booleanFlag
  const { variations } = featureFlag

  return (
    <Layout.Vertical padding="large" margin={{ top: 'large' }} className={css.module}>
      <Layout.Horizontal flex={{ align: 'center-center' }} margin={{ bottom: 'medium' }}>
        <Text style={{ color: '#1C1C28', fontWeight: 600, fontSize: '14px', lineHeight: '22px' }}>
          {i18n.variations}
        </Text>
        <FlexExpander />
        <Button minimal intent="primary" icon="edit" onClick={onEditVariations} style={{}} />
      </Layout.Horizontal>

      <Layout.Vertical className={css.variationsList}>
        <Text
          border={{ bottom: true, color: Color.GREY_300 }}
          padding={{ bottom: 'small' }}
          style={{ fontSize: '14px', lineHeight: '20px' }}
        >
          <VariationTypeIcon style={{ transform: 'translateY(1px)' }} multivariate={!isFlagTypeBoolean} />
          {isFlagTypeBoolean ? i18n.boolean : i18n.multivariate} ({variations.length}{' '}
          {i18n.variations.toLocaleLowerCase()})
        </Text>

        {featureFlag.variations.map((variation, index) => (
          <VariationItem key={variation.identifier} variation={variation} index={index} />
        ))}
      </Layout.Vertical>
    </Layout.Vertical>
  )
}

const FlagActivationDetails: React.FC<FlagActivationDetailsProps> = props => {
  const { featureList, featureFlag, refetchFlag } = props
  const { showError } = useToaster()
  const { getString } = useStrings()
  const { orgIdentifier, accountId, projectIdentifier } = useParams<Record<string, string>>()
  const [editDefaultValuesModal, setEditDefaultValuesModal] = useState<SelectOption[]>([])
  const [isEditingPrerequisites, setEditingPrerequisites] = useState<boolean>(false)
  const featureFlagListURL = routes.toCFFeatureFlags({
    projectIdentifier: projectIdentifier,
    orgIdentifier: orgIdentifier,
    accountId
  })
  const { showSuccess } = useToaster()
  const { mutate: submitPatch } = usePatchFeature({
    identifier: featureFlag.identifier as string,
    queryParams: {
      project: featureFlag.project as string,
      environment: featureFlag.envProperties?.environment as string,
      account: accountId,
      org: orgIdentifier
    }
  })
  const history = useHistory()
  const isBooleanFlag = featureFlag.kind === FlagTypeVariations.booleanFlag

  const setDefaultFlags = (): void => {
    let localVars: SelectOption[] = []
    if (featureFlag.variations.length) {
      // FIXME: Check the TS error about incompatible types
      localVars = featureFlag.variations.map(elem => {
        return { label: elem.identifier as string, value: elem.value as any }
      })
    }
    setEditDefaultValuesModal(localVars)
  }
  const initialVariations = cloneDeep(featureFlag.variations)

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
      variations: featureFlag.variations,
      defaultOnVariation: featureFlag.defaultOnVariation,
      defaultOffVariation: featureFlag.defaultOffVariation
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
                              isOpen={featureFlag.variations[0].description ? true : false}
                            />
                          </Layout.Horizontal>
                          <Layout.Horizontal className={css.variationsContainer}>
                            <FormInput.Text name="variations[1].identifier" label={i18n.editVariations.false} />
                            <InputDescOptional
                              text={i18n.descOptional}
                              inputName="variations[1].description"
                              inputPlaceholder={''}
                              isOpen={featureFlag.variations[1].description ? true : false}
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
                              isOpen={featureFlag.variations[index]?.description ? true : false}
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
  }, [editDefaultValuesModal, featureFlag.variations])

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
      name: featureFlag.name,
      description: featureFlag.description,
      tags: featureFlag.tags?.map(elem => elem.name),
      permanent: featureFlag.permanent
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
  const { mutate: deleteFeatureFlag } = useDeleteFeatureFlag({
    queryParams: {
      project: projectIdentifier as string,
      account: accountId,
      org: orgIdentifier
    }
  })
  const archiveFlag = useConfirmAction({
    title: getString('cf.featureFlags.archiveFlag'),
    message: (
      <Text font="medium">
        <span
          dangerouslySetInnerHTML={{
            __html: getString('cf.featureFlags.archiveFlagMessage', { name: featureFlag.name })
          }}
        ></span>
      </Text>
    ),
    intent: Intent.DANGER,
    action: () => {
      alert('To be implemented') // TODO: Backend is not yet support archiving flag.
    }
  })
  const deleteFlag = useConfirmAction({
    title: getString('cf.featureFlags.deleteFlag'),
    message: (
      <Text font="medium">
        <span
          dangerouslySetInnerHTML={{
            __html: getString('cf.featureFlags.deleteFlagMessage', { name: featureFlag.name })
          }}
        ></span>
      </Text>
    ),
    intent: Intent.DANGER,
    action: async () => {
      try {
        await deleteFeatureFlag(featureFlag.identifier)
        history.replace(featureFlagListURL)
        showSuccess(
          <Text color={Color.WHITE}>
            <span
              dangerouslySetInnerHTML={{
                __html: getString('cf.featureFlags.deleteFlagSuccess', { name: featureFlag.name })
              }}
            />
          </Text>
        )
      } catch (error) {
        showError(error)
      }
    }
  })
  const renderTime = (time: number, style?: React.CSSProperties) => (
    <Text
      style={{
        fontWeight: 500,
        lineHeight: '14px',
        fontSize: '10px',
        color: '#555770',
        letterSpacing: '0.2px',
        ...style
      }}
    >
      {getString('cf.featureFlags.createdDate', {
        date: moment(time).format('MMMM D, YYYY hh:mm A')
      })}
    </Text>
  )
  const prerequisitesTitle = (
    <Text
      style={{
        fontSize: '14px',
        color: '#22222A',
        fontWeight: 600,
        lineHeight: '20px',
        paddingLeft: 'var(--spacing-small)'
      }}
    >
      {getString('cf.featureFlags.prerequisites')}
      <span style={{ fontSize: '12px', fontWeight: 400, display: 'inline-block', marginLeft: 'var(--spacing-xsmall)' }}>
        {getString('cf.featureFlags.prerequisitesDesc')}
      </span>
    </Text>
  )

  return (
    <>
      <Layout.Horizontal className={css.breadcrumb}>
        <Link style={{ color: '#0092E4', fontSize: '12px' }} to={featureFlagListURL}>
          {i18n.flag}
        </Link>
        <span style={{ display: 'inline-block', paddingLeft: 'var(--spacing-xsmall)' }}>/</span>
        <FlexExpander />
        <Button
          minimal
          icon="Options"
          iconProps={{ size: 24 }}
          tooltip={
            <Menu style={{ minWidth: 'unset' }}>
              <Menu.Item icon="edit" text={getString('edit')} onClick={openEditDetailsModal} />
              <Menu.Item
                icon="archive"
                text={getString('archive')}
                onClick={archiveFlag}
                style={{ display: 'none ' }} // TODO: Backend is not yet support archiving flag.
              />
              <Menu.Divider />
              <Menu.Item icon="trash" text={getString('delete')} onClick={deleteFlag} />
            </Menu>
          }
          tooltipProps={{ isDark: true, interactionKind: 'click' }}
        />
      </Layout.Horizontal>

      <Container>
        <Heading
          style={{
            fontWeight: 600,
            fontSize: '16px',
            lineHeight: '22px',
            color: '#1C1C28',
            marginBottom: 'var(--spacing-small)'
          }}
        >
          {featureFlag.name}
        </Heading>
        {featureFlag.description && (
          <Text margin={{ bottom: 'small' }} style={{ fontSize: '13px', lineHeight: '20px', color: '#22222A' }}>
            {featureFlag.description}
          </Text>
        )}

        <IdentifierText identifier={featureFlag.identifier} />

        {!!featureFlag.tags?.length && (
          <Container className={css.tagsFlagActivationDetails}>
            <TagsViewer
              tags={featureFlag.tags?.map(({ value }) => value as string)}
              style={{ backgroundColor: '#D9DAE6', fontSize: '12px', lineHeight: '16px', color: '#22222A' }}
            />
          </Container>
        )}

        <Layout.Vertical margin={{ top: 'medium', bottom: 'xlarge' }}>
          {renderTime(featureFlag.createdAt)}
          {renderTime(featureFlag.modifiedAt, { paddingTop: 'var(--spacing-xsmall)' })}
        </Layout.Vertical>

        <VariationsList
          featureFlag={featureFlag}
          onEditVariations={() => {
            openModalEditVariations()
            setDefaultFlags()
          }}
        />

        <Container className={cx(css.collapseFeatures, css.module)}>
          <Collapse {...editCardCollapsedProps} heading={prerequisitesTitle}>
            {!!featureFlag.prerequisites?.length && (
              <Layout.Horizontal flex margin={{ bottom: 'xsmall' }}>
                <Text width="50%">{i18n.flag}</Text>
                <Text width="50%">{i18n.variation}</Text>
              </Layout.Horizontal>
            )}
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
      </Container>
    </>
  )
}

export default FlagActivationDetails
