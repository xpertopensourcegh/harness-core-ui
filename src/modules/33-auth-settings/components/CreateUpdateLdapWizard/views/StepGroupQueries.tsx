/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React, { useMemo, useRef, useState } from 'react'
import produce from 'immer'
import {
  Button,
  FontVariation,
  Text,
  StepProps,
  Layout,
  ButtonVariation,
  Icon,
  Color,
  Container,
  Formik,
  FormInput,
  FormikForm
} from '@harness/uicore'
import { useParams } from 'react-router-dom'
import type { FormikProps } from 'formik'
import cx from 'classnames'
import { useStrings } from 'framework/strings'
import { LdapGroupSettings, RestResponseLdapTestResponse, useValidateLdapGroupSettings } from 'services/cd-ng'
import type { AccountPathProps } from '@common/interfaces/RouteInterfaces'
import type { CreateUpdateLdapWizardProps, LdapWizardStepProps } from '../CreateUpdateLdapWizard'
import { QueryFormTitle, QueryStepTitle, QueryTestFailMsg, QueryTestSuccessMsg } from '../utils'
import css from '../CreateUpdateLdapWizard.module.scss'

export interface StepGroupQueriesProps {
  name: string
  groupSettingsList?: LdapGroupSettings[]
}

interface GroupQueryPreviewProps {
  index: number
  customClass?: string
}

interface LdapGroupSettingsDraft extends LdapGroupSettings {
  isDraft?: boolean
  isNewSetting?: boolean
}

const AddGroupQuery: React.FC<{ onAddGroupSetting: () => void }> = ({ onAddGroupSetting }) => {
  const { getString } = useStrings()
  return (
    <Layout.Vertical
      flex={{ justifyContent: 'center', alignItems: 'center' }}
      className={css.addQueryCtr}
      spacing="medium"
    >
      <Icon name="user-groups" size={73} />
      <Text font={{ variation: FontVariation.H5 }} color={Color.GREY_600}>
        {getString('authSettings.ldap.addGroupQueryHeading')}
      </Text>
      <Text font={{ variation: FontVariation.BODY }} width={400} className={css.addQueryDescription}>
        {getString('authSettings.ldap.addGroupQueryDescription')}
      </Text>
      <Button
        text={getString('authSettings.ldap.newGroupQuery')}
        icon="plus"
        variation={ButtonVariation.SECONDARY}
        onClick={onAddGroupSetting}
        data-testid="add-first-group-query-btn"
      />
    </Layout.Vertical>
  )
}

const GroupQueryEdit: React.FC<
  LdapGroupSettings &
    GroupQueryPreviewProps & {
      onGroupQueryCommitEdit: (groupSetting: LdapGroupSettings, idx: number) => void
      onGroupQueryDiscardEdit: (idx: number) => void
      onTestGroupQuery: (formVal: LdapGroupSettings) => Promise<RestResponseLdapTestResponse>
    }
> = ({
  baseDN,
  searchFilter,
  descriptionAttr,
  nameAttr,
  index,
  customClass,
  onGroupQueryCommitEdit,
  onGroupQueryDiscardEdit,
  onTestGroupQuery
}) => {
  const { getString } = useStrings()
  const groupQueryFormRef = useRef<FormikProps<LdapGroupSettings>>(null)
  const [groupQueryTestResult, setGroupQueryTestResult] = useState<React.ReactNode | undefined>()
  const testQuery = async (): Promise<void> => {
    try {
      setGroupQueryTestResult(undefined)
      const result = await onTestGroupQuery(
        (groupQueryFormRef.current as FormikProps<LdapGroupSettings>).values as LdapGroupSettings
      )
      if (result.resource?.status === 'SUCCESS') {
        setGroupQueryTestResult(<QueryTestSuccessMsg message={getString('authSettings.ldap.queryTestSuccessful')} />)
      } else {
        setGroupQueryTestResult(<QueryTestFailMsg message={result.resource?.message} />)
      }
    } catch (err) /* istanbul ignore next */ {
      const errMsg = err instanceof Error ? (err?.message as string) : getString('authSettings.ldap.queryTestFail')
      setGroupQueryTestResult(<QueryTestFailMsg message={errMsg} />)
    }
  }
  return (
    <Layout.Vertical spacing="small" padding="medium" className={customClass}>
      <Formik<LdapGroupSettings>
        innerRef={groupQueryFormRef}
        formName={`addEditGroupSetting-${index}`}
        initialValues={{ baseDN, searchFilter, nameAttr, descriptionAttr }}
        onSubmit={formData => {
          onGroupQueryCommitEdit(formData, index)
        }}
      >
        <FormikForm>
          <Layout.Horizontal spacing="small" flex={{ alignItems: 'center' }}>
            <QueryFormTitle title={getString('authSettings.ldap.groupQueryTitle', { index: index + 1 })} />
            <Container className={css.queryCtaContainer} flex={{ alignItems: 'center' }}>
              {groupQueryTestResult}
              <Button
                text={getString('test')}
                variation={ButtonVariation.LINK}
                onClick={testQuery}
                data-testId="test-group-query-btn"
              />
              <Button
                icon="tick"
                className={css.commitBtn}
                color={Color.GREEN_700}
                type="submit"
                minimal
                data-testid="commit-group-query-btn"
              />
              <Button
                icon="cross"
                className={css.undoEditBtn}
                minimal
                data-testid="discard-group-query-btn"
                onClick={() => {
                  onGroupQueryDiscardEdit(index)
                }}
              />
            </Container>
          </Layout.Horizontal>
          <Container className={css.settingsForm}>
            <FormInput.Text
              className={css.queryFormField}
              label={getString('authSettings.ldap.baseDN')}
              name="baseDN"
            />
            <FormInput.Text
              className={css.queryFormField}
              label={getString('authSettings.ldap.searchFilter')}
              name="searchFilter"
            />
            <FormInput.Text
              className={css.queryFormField}
              label={getString('authSettings.ldap.nameAttributes')}
              name="nameAttr"
            />
            <FormInput.Text
              className={css.queryFormField}
              label={getString('authSettings.ldap.descriptionAttributes')}
              name="descriptionAttr"
            />
          </Container>
        </FormikForm>
      </Formik>
    </Layout.Vertical>
  )
}

const GroupQueryPreview: React.FC<
  LdapGroupSettings &
    GroupQueryPreviewProps & {
      onDeleteUserQuery: (idx: number) => void
      onEnableGroupQueryDraftMode: (idx: number) => void
    }
> = ({
  baseDN,
  searchFilter,
  descriptionAttr,
  nameAttr,
  index,
  customClass,
  onDeleteUserQuery,
  onEnableGroupQueryDraftMode
}) => {
  const { getString } = useStrings()
  return (
    <Layout.Vertical spacing="small" padding="medium" className={customClass}>
      <Layout.Horizontal spacing="small" flex={{ alignItems: 'center' }}>
        <Text font={{ variation: FontVariation.H5 }}>
          <Icon name="chevron-down" color={Color.PRIMARY_6} margin={{ right: 'small' }} />
          {getString('authSettings.ldap.groupQueryTitle', { index: index + 1 })}
        </Text>
        <Container className={css.queryCtaContainer}>
          <Button
            icon="edit"
            minimal
            withoutCurrentColor
            data-testid="edit-group-query-btn"
            onClick={() => {
              onEnableGroupQueryDraftMode(index)
            }}
          />
          <Button
            icon="main-trash"
            minimal
            withoutCurrentColor
            data-testid="delete-group-query-btn"
            onClick={() => {
              onDeleteUserQuery(index)
            }}
          />
        </Container>
      </Layout.Horizontal>
      <Layout.Horizontal>
        <ul className={css.userSettingsList}>
          <li>
            <Layout.Horizontal spacing="small" flex={{ alignItems: 'center', justifyContent: 'flex-start' }}>
              <Text font={{ variation: FontVariation.BODY2 }} margin={{ right: 'xsmall' }}>
                {`${getString('authSettings.ldap.baseDN')}: `}
              </Text>
              <Text>{baseDN}</Text>
            </Layout.Horizontal>
          </li>
          <li>
            <Layout.Horizontal spacing="small" flex={{ alignItems: 'center', justifyContent: 'flex-start' }}>
              <Text font={{ variation: FontVariation.BODY2 }} margin={{ right: 'xsmall' }}>
                {`${getString('authSettings.ldap.searchFilter')}: `}
              </Text>
              <Text>{searchFilter}</Text>
            </Layout.Horizontal>
          </li>
          <li>
            <Layout.Horizontal spacing="small" flex={{ alignItems: 'center', justifyContent: 'flex-start' }}>
              <Text font={{ variation: FontVariation.BODY2 }} margin={{ right: 'xsmall' }}>
                {`${getString('authSettings.ldap.nameAttributes')}: `}
              </Text>
              <Text>{nameAttr}</Text>
            </Layout.Horizontal>
          </li>
          <li>
            <Layout.Horizontal spacing="small" flex={{ alignItems: 'center', justifyContent: 'flex-start' }}>
              <Text font={{ variation: FontVariation.BODY2 }} margin={{ right: 'xsmall' }}>
                {`${getString('authSettings.ldap.groupMembershipAttributes')}: `}
              </Text>
              <Text>{descriptionAttr}</Text>
            </Layout.Horizontal>
          </li>
        </ul>
      </Layout.Horizontal>
    </Layout.Vertical>
  )
}

export const StepGroupQueries: React.FC<
  StepProps<CreateUpdateLdapWizardProps> & LdapWizardStepProps<LdapGroupSettings[]>
> = props => {
  const { getString } = useStrings()
  const { stepData, name, updateStepData, auxilliaryData, triggerSaveData } = props
  const [groupSettingsList, setGroupSettingsList] = useState<LdapGroupSettingsDraft[]>(stepData || [])
  const [isAddSettingEnabled, setIsAddSettingEnabled] = useState<boolean>(true)
  const { accountId } = useParams<AccountPathProps>()
  const isSettingsListEmpty = useMemo(() => groupSettingsList.length === 0, [groupSettingsList])
  const { mutate: validateGroupSettings } = useValidateLdapGroupSettings({
    queryParams: {
      accountIdentifier: accountId
    }
  })
  const onDeleteUserQuery = (idx: number): void => {
    setGroupSettingsList(
      produce(groupSettingsList, draft => {
        draft.splice(idx, 1)
      })
    )
  }
  const onEnableGroupQueryDraftMode = (idx: number): void => {
    setGroupSettingsList(
      produce(groupSettingsList, draft => {
        draft[idx].isDraft = true
      })
    )
  }
  const onGroupQueryCommitEdit = (groupSetting: LdapGroupSettingsDraft, idx: number): void => {
    setGroupSettingsList(
      produce(groupSettingsList, draft => {
        if (draft[idx].isNewSetting) {
          setIsAddSettingEnabled(true)
          delete groupSetting.isNewSetting
        }
        delete groupSetting.isDraft
        draft[idx] = groupSetting
      })
    )
  }
  const onGroupQueryDiscardEdit = (idx: number): void => {
    setGroupSettingsList(
      produce(groupSettingsList, draft => {
        if (draft[idx].isNewSetting) {
          // A newly added draft is discarded, hence it should be removed from list
          draft.splice(idx, 1)
          setIsAddSettingEnabled(true)
          return
        }
        delete draft[idx].isDraft
        delete draft[idx].isNewSetting
      })
    )
  }
  const onAddGroupSetting = (): void => {
    setGroupSettingsList(
      produce(groupSettingsList, draft => {
        draft.unshift({ isDraft: true, isNewSetting: true })
        setIsAddSettingEnabled(false)
      })
    )
  }
  const onTestGroupQuery = (ldapGroupSetting: LdapGroupSettings): Promise<RestResponseLdapTestResponse> => {
    return validateGroupSettings({
      displayName: auxilliaryData?.displayName,
      groupSettingsList: [ldapGroupSetting],
      appId: '',
      connectionSettings: auxilliaryData?.connectionSettings || { host: '' },
      uuid: auxilliaryData?.identifier || '',
      type: 'LDAP',
      lastUpdatedAt: 0,
      accountId: accountId
    })
  }
  const GroupQueryListPreview = groupSettingsList?.map((groupSetting, groupQueryIdx) => {
    if (groupSetting.isDraft) {
      return (
        <GroupQueryEdit
          {...groupSetting}
          key={`${groupSetting.nameAttr}_${groupQueryIdx}`}
          index={groupQueryIdx}
          customClass={css.queryDraftItem}
          onGroupQueryCommitEdit={onGroupQueryCommitEdit}
          onGroupQueryDiscardEdit={onGroupQueryDiscardEdit}
          onTestGroupQuery={onTestGroupQuery}
        />
      )
    }
    return (
      <GroupQueryPreview
        {...groupSetting}
        key={`${groupSetting.nameAttr}_${groupQueryIdx}`}
        index={groupQueryIdx}
        customClass={css.queryPreviewItem}
        onEnableGroupQueryDraftMode={onEnableGroupQueryDraftMode}
        onDeleteUserQuery={onDeleteUserQuery}
      />
    )
  })
  return (
    <Layout.Vertical className={cx(css.stepContainer, css.stepQueryContainer)}>
      <QueryStepTitle stepTitle={name as string} />
      <Layout.Horizontal margin={{ bottom: 'medium' }} className={css.alignCenter}>
        <Text className={css.fluidLabel}>{getString('authSettings.ldap.setScopeForGroupQuery')}</Text>
        {!isSettingsListEmpty && (
          <Button
            text={getString('authSettings.ldap.newGroupQuery')}
            disabled={!isAddSettingEnabled}
            icon="plus"
            variation={ButtonVariation.SECONDARY}
            data-testid="add-another-group-query-btn"
            onClick={onAddGroupSetting}
          />
        )}
      </Layout.Horizontal>
      <Layout.Vertical className={css.queryCtr}>
        {isSettingsListEmpty ? (
          <AddGroupQuery onAddGroupSetting={onAddGroupSetting} />
        ) : (
          <Container className={css.settingsListCtr}>{GroupQueryListPreview}</Container>
        )}
      </Layout.Vertical>
      <Layout.Horizontal className={css.stepCtaContainer}>
        <Button
          onClick={() => props.previousStep?.()}
          text={getString('back')}
          icon="chevron-left"
          margin={{ right: 'small' }}
          variation={ButtonVariation.SECONDARY}
          data-testid="back-to-user-query-step"
        />
        <Button
          intent="primary"
          onClick={() => {
            updateStepData(groupSettingsList)
            triggerSaveData?.()
          }}
          text={getString('save')}
          rightIcon="chevron-right"
          data-testid="submit-group-query-step"
        />
      </Layout.Horizontal>
    </Layout.Vertical>
  )
}

export default StepGroupQueries
