import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import type { FormikProps } from 'formik'
import * as Yup from 'yup'
import {
  Formik,
  FormikForm,
  FormInput,
  Radio,
  RadioGroup,
  TextInput,
  Button,
  Layout,
  Text,
  Container
} from '@wings-software/uikit'
import _cloneDeep from 'lodash/cloneDeep'
import cx from 'classnames'
import { useToaster } from '@common/exports'
import { PageSpinner } from '@common/components/Page/PageSpinner'

import {
  ConnectorResponse,
  GitSyncConfigDTO,
  GitSyncFolderConfigDTO,
  useGetConnectorList,
  useListGitSync,
  usePostGitSync,
  usePutGitSync,
  ResponsePageConnectorResponse
} from 'services/cd-ng'

import type { UseGetMockData } from '@common/utils/testUtils'
import i18n from './GitSyncRepoTab.i18n'
import css from './GitSyncRepo.module.scss'

interface RepoProps {
  repo: GitSyncConfigDTO
  key?: string
  serverList: Array<ConnectorResponse>
  persistGitSyncConnector?: Function
  abort?: Function
}

interface RepoListProps {
  repoList: Array<GitSyncConfigDTO>
  serverList: Array<ConnectorResponse>
  persistGitSyncConnector: Function
}

enum RepoState {
  VIEW = 'VIEW',
  ADD = 'ADD',
  EDIT = 'EDIT'
}

const getNewRootFolder = (rootFolder?: string): GitSyncFolderConfigDTO => {
  return { rootFolder: rootFolder || '', isDefault: false, identifier: '', enabled: false } as GitSyncFolderConfigDTO
}

const GitSyncRepo: React.FC<RepoProps> = (props: RepoProps) => {
  const repo = props.repo
  const [repoState, setRepoState] = useState(props.repo.identifier ? RepoState.VIEW : RepoState.ADD)
  const schema = Yup.object().shape({
    gitConnectorId: Yup.string().trim().required(i18n.validation.gitConnectorId),
    repo: Yup.string().trim().required(i18n.validation.repo),
    branch: Yup.string().trim().required(i18n.validation.branch)
  })

  const [rootFolders, setRootFolders] = useState(() => _cloneDeep(repo.gitSyncFolderConfigDTOs))

  const renderForm: React.FC<FormikProps<GitSyncConfigDTO>> = (formikProps: FormikProps<GitSyncConfigDTO>) => {
    return (
      <FormikForm>
        <Container
          margin={{ top: 'medium', right: 'huge', bottom: 'small', left: 'xlarge' }}
          className={cx(css.contentGrid, css.gitSyncGrid)}
        >
          <FormInput.Select
            name="gitConnectorId"
            onChange={() => {
              repoState === RepoState.VIEW && setRepoState(RepoState.EDIT)
            }}
            items={props.serverList.map(server => {
              return { label: server.connector?.name || '', value: server.connector?.identifier || '' }
            })}
          />
          <FormInput.Text
            name="repo"
            placeholder={i18n.placeholders.repoName}
            onChange={() => {
              repoState === RepoState.VIEW && setRepoState(RepoState.EDIT)
            }}
          />
          <FormInput.Text
            name="branch"
            placeholder={i18n.placeholders.brachName}
            onChange={() => {
              repoState === RepoState.VIEW && setRepoState(RepoState.EDIT)
            }}
          />
          <Layout.Vertical spacing="small">
            {rootFolders?.map((_folder, i) => {
              return (
                <TextInput
                  className={css.rootFolder}
                  value={rootFolders[i].rootFolder}
                  placeholder={i18n.placeholders.rootFolder}
                  key={rootFolders[i].identifier || i}
                  onChange={e => {
                    const element = e.currentTarget as HTMLInputElement
                    const temp = rootFolders.slice()
                    temp[i] = getNewRootFolder(element.value)
                    setRootFolders(temp)
                    repoState === RepoState.VIEW && setRepoState(RepoState.EDIT)
                  }}
                ></TextInput>
              )
            })}
            <Button
              minimal
              intent="primary"
              className={css.unsetButtons}
              text={i18n.addFolderButton}
              onClick={() => {
                repoState === RepoState.VIEW && setRepoState(RepoState.EDIT)
                setRootFolders(rootFolders?.concat([getNewRootFolder()]))
              }}
            />
          </Layout.Vertical>

          <RadioGroup className={css.radioGroup}>
            <Layout.Vertical spacing="small">
              {rootFolders?.map((folder, i) => {
                return (
                  <Radio
                    className={css.defaultRootRadio}
                    key={rootFolders[i].identifier || i}
                    checked={!!(rootFolders && rootFolders[i].isDefault)}
                    disabled={!folder.rootFolder}
                    onChange={e => {
                      const temp = rootFolders.slice().map(tempFolder => {
                        tempFolder.isDefault = false
                        return tempFolder
                      })
                      folder.isDefault = !!(e.currentTarget as HTMLInputElement).checked
                      temp[i] = folder
                      setRootFolders(temp)
                      repoState === RepoState.VIEW && setRepoState(RepoState.EDIT)
                    }}
                  />
                )
              })}
            </Layout.Vertical>
          </RadioGroup>
        </Container>
        {repoState === RepoState.VIEW ? null : (
          <Container padding="medium" className={css.editRepoContainer}>
            <Button
              intent="primary"
              type="submit"
              margin={{ right: 'large' }}
              className={css.saveButton}
              text={i18n.saveButton}
            />
            <Button
              intent="danger"
              className={css.cancelButton}
              text={i18n.cancelButton}
              onClick={() => {
                formikProps.values.gitConnectorId = formikProps.initialValues.gitConnectorId
                formikProps.values.repo = formikProps.initialValues.repo
                formikProps.values.branch = formikProps.initialValues.branch
                setRootFolders(_cloneDeep(repo.gitSyncFolderConfigDTOs))
                setRepoState(RepoState.VIEW)
                props.abort?.()
              }}
            />
          </Container>
        )}
      </FormikForm>
    )
  }

  return (
    <section className={css.repoContainer} key={repo.identifier || ''}>
      <Formik<GitSyncConfigDTO>
        initialValues={repo}
        onSubmit={values => {
          const payload = values
          payload.gitSyncFolderConfigDTOs = rootFolders
          props.persistGitSyncConnector && props.persistGitSyncConnector(payload, repoState)
          setRepoState(RepoState.VIEW)
        }}
        validationSchema={schema}
      >
        {renderProps => renderForm(renderProps)}
      </Formik>
    </section>
  )
}

const RepoHeader: React.FC = () => {
  return (
    <section className={cx(css.header, css.gitSyncGrid)}>
      <Text className={css.columnHeader}>{i18n.heading.gitServer}</Text>
      <Text className={css.columnHeader}>{i18n.heading.gitrepo}</Text>
      <Text className={css.columnHeader}>{i18n.heading.branch}</Text>
      <Container>
        <Text className={css.columnHeader}>{i18n.heading.rootFolders}</Text>
        <Text className={css.columnHeaderBody}>{i18n.heading.description.rootFolders}</Text>
      </Container>
      <Container>
        <Text className={css.columnHeader}>{i18n.heading.default}</Text>
        <Text className={css.columnHeaderBody}>{i18n.heading.description.default}</Text>
      </Container>
    </section>
  )
}

export const RepoList: React.FC<RepoListProps> = props => {
  return (
    <React.Fragment>
      {props.repoList.map((repo, i) => {
        return (
          <GitSyncRepo
            repo={repo}
            key={repo?.identifier || i.toString()}
            serverList={props.serverList}
            persistGitSyncConnector={props.persistGitSyncConnector}
          ></GitSyncRepo>
        )
      })}
    </React.Fragment>
  )
}

interface GitSyncRepoTabProps {
  gitSyncMockData?: UseGetMockData<Array<GitSyncConfigDTO>> | undefined
  gitConnectorsMockData?: UseGetMockData<ResponsePageConnectorResponse> | undefined
}

const GitSyncRepoTab: React.FC<GitSyncRepoTabProps> = props => {
  const { showSuccess, showError } = useToaster()
  const [isAddingRepo, setIsAddingRepo] = useState(false)
  const { accountId } = useParams()

  // ToDo: Add suuport for orgId annd projectId level, once BE support is added
  const { loading: loadingGitSyncList, data: dataAllGitSync, refetch: reloadAllGitSync } = useListGitSync({
    queryParams: { accountId },
    mock: props.gitSyncMockData
  })

  const { loading: loadingGitServerList, data: dataAllGitServerListResponse } = useGetConnectorList({
    queryParams: { accountIdentifier: accountId, type: 'Git' },
    mock: props.gitConnectorsMockData
  })

  const { mutate: createGitSyncConnector } = usePostGitSync({ queryParams: { accountId } })
  const { mutate: updateGitSyncConnector } = usePutGitSync({ queryParams: { accountId }, identifier: '' })

  const persistGitSyncConnector = async (values: GitSyncConfigDTO, action: RepoState): Promise<void> => {
    const dataToSubmit: GitSyncConfigDTO = { ...values, accountId }
    try {
      if (action === RepoState.EDIT) {
        await updateGitSyncConnector(dataToSubmit, {
          pathParams: { identifier: values.identifier as string }
        })
      } else {
        await createGitSyncConnector(dataToSubmit)
      }
      showSuccess(i18n.toaster.success)
      await reloadAllGitSync()
      setIsAddingRepo(false)
    } catch (error) {
      showError(error.msg || i18n.toaster.error)
    }
  }

  const abortAdding = (): void => {
    setIsAddingRepo(false)
  }

  return loadingGitServerList || loadingGitSyncList ? (
    <PageSpinner />
  ) : (
    <Container
      padding={{ top: 'large', right: 'xxxlarge', bottom: 'large', left: 'xxxlarge' }}
      className={css.bodyContainer}
    >
      <RepoHeader></RepoHeader>
      <RepoList
        repoList={dataAllGitSync || []}
        serverList={dataAllGitServerListResponse?.data?.content || []}
        persistGitSyncConnector={persistGitSyncConnector}
      />
      {isAddingRepo ? (
        <GitSyncRepo
          repo={
            {
              identifier: '',
              gitConnectorId: dataAllGitServerListResponse?.data?.content?.[0]?.connector?.identifier || '',
              repo: '',
              branch: '',
              gitSyncFolderConfigDTOs: [getNewRootFolder()]
            } as GitSyncConfigDTO
          }
          abort={abortAdding}
          persistGitSyncConnector={persistGitSyncConnector}
          serverList={dataAllGitServerListResponse?.data?.content || []}
        />
      ) : (
        <Container padding="medium" className={css.repoContainer}>
          <Button
            minimal
            intent="primary"
            margin={{ right: 'medium' }}
            text={i18n.addRepositoryButton}
            onClick={() => setIsAddingRepo(true)}
          />
          <Text inline>{i18n.addRepositoryText}</Text>
        </Container>
      )}
    </Container>
  )
}

export default GitSyncRepoTab
