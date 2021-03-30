import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { get, isEqual, flatMap } from 'lodash-es'
import { Link } from 'react-router-dom'
import {
  Color,
  Layout,
  Text,
  FlexExpander,
  Button,
  Container,
  Heading,
  Collapse,
  Formik,
  FormikForm as Form,
  FormInput,
  useModalHook
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
import { OptionsMenuButton, MenuDivider } from '@common/components'
import { Feature, Features, Prerequisite, useDeleteFeatureFlag, usePatchFeature, Variation } from 'services/cf'
import { VariationWithIcon } from '@cf/components/VariationWithIcon/VariationWithIcon'
import { useConfirmAction } from '@common/hooks'
import { getErrorMessage } from '@cf/utils/CFUtils'
import { FlagTypeVariations } from '../CreateFlagDialog/FlagDialogUtils'
import patch from '../../utils/instructions'
import { VariationTypeIcon } from '../VariationTypeIcon/VariationTypeIcon'
import { IdentifierText } from '../IdentifierText/IdentifierText'
import { EditVariationsModal } from '../EditVariationsModal/EditVariationsModal'
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

const VariationsList: React.FC<{ featureFlag: Feature; onEditSuccess: () => void }> = ({
  featureFlag,
  onEditSuccess
}) => {
  const { orgIdentifier, accountId, projectIdentifier } = useParams<Record<string, string>>()
  const isFlagTypeBoolean = featureFlag.kind === FlagTypeVariations.booleanFlag
  const { variations } = featureFlag
  const { getString } = useStrings()

  return (
    <Layout.Vertical padding="large" margin={{ top: 'large' }} className={css.module}>
      <Layout.Horizontal flex={{ align: 'center-center' }} margin={{ bottom: 'medium' }}>
        <Text style={{ color: '#1C1C28', fontWeight: 600, fontSize: '14px', lineHeight: '22px' }}>
          {getString('cf.shared.variations')}
        </Text>
        <FlexExpander />
        <EditVariationsModal
          accountId={accountId}
          orgIdentifier={orgIdentifier}
          projectIdentifier={projectIdentifier}
          feature={featureFlag}
          onSuccess={onEditSuccess}
          minimal
          intent="primary"
          icon="edit"
        />
      </Layout.Horizontal>

      <Layout.Vertical className={css.variationsList}>
        <Text
          border={{ bottom: true, color: Color.GREY_300 }}
          padding={{ bottom: 'small' }}
          style={{ fontSize: '14px', lineHeight: '20px' }}
        >
          <VariationTypeIcon style={{ transform: 'translateY(1px)' }} multivariate={!isFlagTypeBoolean} />
          {isFlagTypeBoolean ? getString('cf.boolean') : getString('cf.multivariate')} ({variations.length}{' '}
          {getString('cf.shared.variations').toLocaleLowerCase()})
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
  const { showError, showSuccess } = useToaster()
  const { getString } = useStrings()
  const { orgIdentifier, accountId, projectIdentifier } = useParams<Record<string, string>>()
  const [isEditingPrerequisites, setEditingPrerequisites] = useState<boolean>(false)
  const featureFlagListURL = routes.toCFFeatureFlags({
    projectIdentifier: projectIdentifier,
    orgIdentifier: orgIdentifier,
    accountId
  })
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
      ? getString('cf.addPrerequisites.editPrerequisitesHeading')
      : getString('cf.addPrerequisites.addPrerequisitesHeading')

    return (
      <Dialog title={title} onClose={hideModalPrerequisites} isOpen={true}>
        <Layout.Vertical padding={{ left: 'large', right: 'medium' }}>
          <Text margin={{ top: 'medium', bottom: 'xlarge' }}>
            {getString('cf.addPrerequisites.addPrerequisitesDesc')}
          </Text>
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
                                placeholder={getString('cf.addPrerequisites.selectFlag')}
                                items={
                                  featureList?.features?.map((flag: Feature) => ({
                                    label: flag.name,
                                    value: flag.identifier
                                  })) || []
                                }
                              />
                              <FormInput.Select
                                name={`prerequisites.${i}.variation`}
                                placeholder={getString('cf.addPrerequisites.selectVariation')}
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
                          text={getString('cf.shared.prerequisites')}
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
                  <Button text={getString('save')} intent="primary" margin={{ right: 'small' }} type="submit" />
                  <Button text={getString('cancel')} onClick={hideModalPrerequisites} />
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
                <Text>{getString('cf.editDetails.editDetailsHeading')}</Text>

                <FormInput.Text name="name" label={getString('name')} />

                <FormInput.TextArea name="description" label={getString('description')} />

                <FormInput.TagInput
                  name="tags"
                  label={getString('tagsLabel')}
                  items={[]}
                  labelFor={nameTag => nameTag as string}
                  itemFromNewTag={newTag => newTag}
                  tagInputProps={{ showAddTagButton: true, allowNewTag: true }}
                />

                <Layout.Horizontal padding={{ top: 'medium', bottom: 'medium' }}>
                  <FormInput.CheckBox
                    name="permanent"
                    label={getString('cf.editDetails.permaFlag')}
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
                  <Button intent="primary" text={getString('save')} type="submit" />
                  <Button minimal text={getString('cancel')} onClick={hideEditDetailsModal} />
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
      <Text>
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
      <Text>
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
        deleteFeatureFlag(featureFlag.identifier)
          .then(() => {
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
          })
          .catch(error => {
            showError(getErrorMessage(error), 0)
          })
      } catch (error) {
        showError(getErrorMessage(error), 0)
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
      {getString('cf.shared.prerequisites')}
      <span style={{ fontSize: '12px', fontWeight: 400, display: 'inline-block', marginLeft: 'var(--spacing-xsmall)' }}>
        {getString('cf.featureFlags.prerequisitesDesc')}
      </span>
    </Text>
  )

  return (
    <>
      <Layout.Horizontal className={css.breadcrumb}>
        <Link style={{ color: '#0092E4', fontSize: '12px' }} to={featureFlagListURL}>
          {getString('flag')}
        </Link>
        <span style={{ display: 'inline-block', paddingLeft: 'var(--spacing-xsmall)' }}>/</span>
        <FlexExpander />
        <OptionsMenuButton
          items={[
            {
              icon: 'edit',
              text: getString('edit'),
              onClick: openEditDetailsModal
            },
            {
              disabled: true,
              icon: 'archive',
              text: getString('archive'),
              onClick: archiveFlag,
              title: getString('cf.featureNotReady')
            },
            MenuDivider,
            {
              icon: 'trash',
              text: getString('delete'),
              onClick: deleteFlag
            }
          ]}
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

        <IdentifierText identifier={featureFlag.identifier} allowCopy />

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
          onEditSuccess={() => {
            refetchFlag()
          }}
        />

        <Container className={cx(css.collapseFeatures, css.module)}>
          <Collapse {...editCardCollapsedProps} heading={prerequisitesTitle}>
            {!!featureFlag.prerequisites?.length && (
              <Layout.Horizontal flex margin={{ bottom: 'xsmall' }}>
                <Text width="50%">{getString('flag')}</Text>
                <Text width="50%">{getString('cf.shared.variation')}</Text>
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
                      style={{ marginLeft: 'auto' }}
                      tooltip={
                        <Menu style={{ minWidth: 'unset' }}>
                          <Menu.Item
                            icon="edit"
                            text={getString('edit')}
                            onClick={handlePrerequisiteInteraction('edit', elem)}
                          />
                          <Menu.Item
                            icon="cross"
                            text={getString('delete')}
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
                text={getString('cf.shared.prerequisites')}
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
