import React from 'react'
import { openDB, IDBPDatabase, deleteDB } from 'idb'
import { isEqual, cloneDeep } from 'lodash'
import { parse, stringify } from 'yaml'
import {
  CDPipeline,
  GetPipelineListQueryParams,
  getPipelinePromise,
  postPipelineDummyPromise,
  putPipelinePromise,
  PutPipelineQueryParams,
  ResponseDTOCDPipelineResponseDTO,
  FailureDTO
} from 'services/cd-ng'
import { ModuleName, loggerFor } from 'framework/exports'
import SessionToken from 'framework/utils/SessionToken'
import {
  PipelineReducerState,
  ActionReturnType,
  PipelineContextActions,
  DefaultNewPipelineId,
  DefaultPipeline,
  initialState,
  PipelineReducer,
  PipelineViewData
} from './PipelineActions'
const logger = loggerFor(ModuleName.CD)

export const getPipelineByIdentifier = (
  params: GetPipelineListQueryParams,
  identifier: string
): Promise<CDPipeline | undefined> => {
  return getPipelinePromise({
    pipelineIdentifier: identifier,
    queryParams: {
      accountIdentifier: params.accountIdentifier,
      orgIdentifier: params.orgIdentifier,
      projectIdentifier: params.projectIdentifier
    },
    requestOptions: {
      headers: {
        'content-type': 'text/yaml'
      }
    }
  }).then(response => {
    let obj = {} as ResponseDTOCDPipelineResponseDTO
    if (typeof response === 'string') {
      obj = parse(response as string).data.yamlPipeline
    } else if (response.data?.yamlPipeline) {
      obj = response
    }
    if (obj.status === 'SUCCESS' && obj.data?.yamlPipeline) {
      return parse(obj.data.yamlPipeline as string).pipeline as CDPipeline
    }
  })
}

export const savePipeline = (
  params: PutPipelineQueryParams,
  pipeline: CDPipeline,
  isEdit = false
): Promise<FailureDTO | undefined> => {
  return isEdit
    ? putPipelinePromise({
        pipelineIdentifier: pipeline.identifier,
        queryParams: {
          accountIdentifier: params.accountIdentifier,
          projectIdentifier: params.projectIdentifier,
          orgIdentifier: params.orgIdentifier
        },
        body: stringify({ pipeline }),
        requestOptions: { headers: { 'Content-Type': 'text/yaml' } }
      }).then(response => {
        if (typeof response === 'string') {
          return JSON.parse(response as string) as FailureDTO
        } else {
          return response
        }
      })
    : postPipelineDummyPromise({
        body: stringify({ pipeline }) as any,
        queryParams: {
          accountIdentifier: params.accountIdentifier,
          projectIdentifier: params.projectIdentifier,
          orgIdentifier: params.orgIdentifier
        },
        requestOptions: { headers: { 'Content-Type': 'text/yaml' } }
      }).then(response => {
        if (typeof response === 'string') {
          return JSON.parse((response as unknown) as string) as FailureDTO
        } else {
          return (response as unknown) as FailureDTO
        }
      })
}

const DBInitializationFailed = 'DB Creation retry exceeded.'

let IdbPipeline: IDBPDatabase | undefined
const IdbPipelineStoreName = 'pipeline-cache'
const PipelineDBName = 'pipeline-db'
const KeyPath = 'identifier'

interface PipelineContextInterface {
  state: PipelineReducerState
  fetchPipeline: (forceFetch?: boolean, forceUpdate?: boolean) => Promise<void>
  updatePipeline: (pipeline: CDPipeline) => Promise<void>
  updatePipelineView: (data: PipelineViewData) => void
  deletePipelineCache: () => void
  pipelineSaved: (pipeline: CDPipeline) => void
}

interface PipelinePayload {
  identifier: string
  pipeline: CDPipeline | undefined
  originalPipeline?: CDPipeline
  isUpdated: boolean
}

const getId = (
  accountIdentifier: string,
  orgIdentifier: string,
  projectIdentifier: string,
  pipelineIdentifier: string
): string => `${accountIdentifier}_${orgIdentifier}_${projectIdentifier}_${pipelineIdentifier}`

const _fetchPipeline = async (
  dispatch: React.Dispatch<ActionReturnType>,
  queryParams: GetPipelineListQueryParams,
  identifier: string,
  forceFetch = false,
  forceUpdate = false
): Promise<void> => {
  const id = getId(
    queryParams.accountIdentifier,
    queryParams.orgIdentifier || '',
    queryParams.projectIdentifier || '',
    identifier
  )
  if (IdbPipeline) {
    dispatch(PipelineContextActions.fetching())
    const data: PipelinePayload = await IdbPipeline.get(IdbPipelineStoreName, id)
    if ((!data || forceFetch) && identifier !== DefaultNewPipelineId) {
      const pipeline = await getPipelineByIdentifier(queryParams, identifier)
      const payload: PipelinePayload = {
        [KeyPath]: id,
        pipeline,
        originalPipeline: cloneDeep(pipeline),
        isUpdated: false
      }
      if (data && !forceUpdate) {
        dispatch(
          PipelineContextActions.success({
            error: '',
            pipeline: data.pipeline,
            originalPipeline: cloneDeep(pipeline),
            isBEPipelineUpdated: !isEqual(pipeline, data.originalPipeline),
            isUpdated: !isEqual(pipeline, data.pipeline)
          })
        )
        dispatch(PipelineContextActions.initialized())
      } else {
        await IdbPipeline.put(IdbPipelineStoreName, payload)
        dispatch(
          PipelineContextActions.success({
            error: '',
            pipeline,
            originalPipeline: cloneDeep(pipeline),
            isBEPipelineUpdated: false,
            isUpdated: false
          })
        )
        dispatch(PipelineContextActions.initialized())
      }
    } else {
      dispatch(
        PipelineContextActions.success({
          error: '',
          pipeline: data?.pipeline || { ...DefaultPipeline },
          originalPipeline: cloneDeep(data?.pipeline) || cloneDeep(DefaultPipeline),
          isUpdated: true,
          isBEPipelineUpdated: false
        })
      )
      dispatch(PipelineContextActions.initialized())
    }
  } else {
    dispatch(PipelineContextActions.success({ error: 'DB is not initialized' }))
  }
}

const _updatePipeline = async (
  dispatch: React.Dispatch<ActionReturnType>,
  queryParams: GetPipelineListQueryParams,
  identifier: string,
  originalPipeline: CDPipeline,
  pipeline: CDPipeline
): Promise<void> => {
  const id = getId(
    queryParams.accountIdentifier,
    queryParams.orgIdentifier || '',
    queryParams.projectIdentifier || '',
    identifier
  )
  if (IdbPipeline) {
    const isUpdated = !isEqual(originalPipeline, pipeline)
    const payload: PipelinePayload = {
      [KeyPath]: id,
      pipeline,
      originalPipeline,
      isUpdated
    }
    await IdbPipeline.put(IdbPipelineStoreName, payload)
    dispatch(PipelineContextActions.success({ error: '', pipeline, isUpdated }))
  }
}

const cleanUpDBRefs = (): void => {
  if (IdbPipeline) {
    IdbPipeline.close()
    IdbPipeline = undefined
  }
}

const _initializeDb = async (dispatch: React.Dispatch<ActionReturnType>, version: number, trial = 0): Promise<void> => {
  if (!IdbPipeline) {
    try {
      dispatch(PipelineContextActions.updating())
      IdbPipeline = await openDB(PipelineDBName, version, {
        upgrade(db) {
          try {
            db.deleteObjectStore(IdbPipelineStoreName)
          } catch (_) {
            logger.error('There was no DB found')
            dispatch(PipelineContextActions.error({ error: 'There was no DB found' }))
          }
          const objectStore = db.createObjectStore(IdbPipelineStoreName, { keyPath: KeyPath, autoIncrement: false })
          objectStore.createIndex(KeyPath, KeyPath, { unique: true })
        },
        async blocked() {
          cleanUpDBRefs()
        },
        async blocking() {
          cleanUpDBRefs()
        }
      })
      dispatch(PipelineContextActions.dbInitialized())
    } catch (e) {
      logger.info('DB downgraded, deleting and re creating the DB')

      await deleteDB(PipelineDBName)
      IdbPipeline = undefined

      ++trial

      if (trial < 5) {
        _initializeDb(dispatch, version, trial)
      } else {
        logger.error(DBInitializationFailed)
        dispatch(PipelineContextActions.error({ error: DBInitializationFailed }))
      }
    }
  } else {
    dispatch(PipelineContextActions.dbInitialized())
  }
}

const _deletePipelineCache = async (
  dispatch: React.Dispatch<ActionReturnType>,
  queryParams: GetPipelineListQueryParams,
  identifier: string
): Promise<void> => {
  if (IdbPipeline) {
    dispatch(PipelineContextActions.updating())
    const id = getId(
      queryParams.accountIdentifier,
      queryParams.orgIdentifier || '',
      queryParams.projectIdentifier || '',
      identifier
    )
    await IdbPipeline.delete(IdbPipelineStoreName, id)
  }
}

export const PipelineContext = React.createContext<PipelineContextInterface>({
  state: initialState,
  fetchPipeline: () => new Promise<void>(() => undefined),
  updatePipelineView: () => undefined,
  updatePipeline: () => new Promise<void>(() => undefined),
  pipelineSaved: () => undefined,
  deletePipelineCache: () => undefined
})

export const PipelineProvider: React.FC<{
  queryParams: GetPipelineListQueryParams
  pipelineIdentifier: string
}> = ({ queryParams, pipelineIdentifier, children }) => {
  const [state, dispatch] = React.useReducer(PipelineReducer, initialState)
  state.pipelineIdentifier = pipelineIdentifier
  const fetchPipeline = _fetchPipeline.bind(null, dispatch, queryParams, pipelineIdentifier)
  const updatePipeline = _updatePipeline.bind(null, dispatch, queryParams, pipelineIdentifier, state.originalPipeline)
  const deletePipelineCache = _deletePipelineCache.bind(null, dispatch, queryParams, pipelineIdentifier)
  const pipelineSaved = React.useCallback(
    (pipeline: CDPipeline) => {
      deletePipelineCache()
      dispatch(PipelineContextActions.pipelineSavedAction({ pipeline, originalPipeline: cloneDeep(pipeline) }))
    },
    [deletePipelineCache]
  )

  const updatePipelineView = React.useCallback((data: PipelineViewData) => {
    dispatch(PipelineContextActions.updatePipelineView({ pipelineView: data }))
  }, [])

  React.useEffect(() => {
    if (state.isDBInitialized) {
      fetchPipeline(true)
    }
  }, [state.isDBInitialized])
  React.useEffect(() => {
    const time = SessionToken.getLastTokenSetTime()
    _initializeDb(dispatch, time || +new Date())
  }, [])
  return (
    <PipelineContext.Provider
      value={{ state, fetchPipeline, updatePipeline, updatePipelineView, pipelineSaved, deletePipelineCache }}
    >
      {children}
    </PipelineContext.Provider>
  )
}
