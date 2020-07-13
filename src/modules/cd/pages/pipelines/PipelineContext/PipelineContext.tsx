import React from 'react'
import type { CDPipelineDTO, GetNgPipelineByIdentifierQueryParams, ResponseDTOCDPipelineDTO } from 'services/cd-ng'
import { openDB, IDBPDatabase, deleteDB } from 'idb'
import { ModuleName, loggerFor } from 'framework/exports'
import xhr from '@wings-software/xhr-async'
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
import { parse } from 'yaml'
const logger = loggerFor(ModuleName.CD)

export const getPipelineByIdentifier = (
  params: GetNgPipelineByIdentifierQueryParams,
  identifier: string
): Promise<CDPipelineDTO | undefined> => {
  return xhr
    .get<ResponseDTOCDPipelineDTO>(
      `/cd/api/pipelines/${identifier}?accountIdentifier=${params.accountIdentifier}&projectIdentifier=${params.projectIdentifier}&orgIdentifier=${params.orgIdentifier}`
    )
    .then(xhrResponse => {
      if (xhrResponse.response?.data?.yamlPipeline) {
        return parse(xhrResponse.response.data.yamlPipeline).pipeline as CDPipelineDTO
      }
      return
    })
}

const DBInitializationFailed = 'DB Creation retry exceeded.'

let IdbPipeline: IDBPDatabase | undefined
const IdbPipelineStoreName = 'pipeline-cache'
const PipelineDBName = 'pipeline-db'
const KeyPath = 'identifier'

interface PipelineContextInterface {
  state: PipelineReducerState
  fetchPipeline: (forceFetch?: boolean) => Promise<void>
  updatePipeline: (pipeline: CDPipelineDTO) => Promise<void>
  updatePipelineView: (data: PipelineViewData) => void
  deletePipelineCache: () => void
  pipelineSaved: () => void
}

interface PipelinePayload {
  identifier: string
  pipeline: CDPipelineDTO | undefined
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
  queryParams: GetNgPipelineByIdentifierQueryParams,
  identifier: string,
  forceFetch = false
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
        isUpdated: false
      }
      if (pipeline) {
        await IdbPipeline.put(IdbPipelineStoreName, payload)
        dispatch(PipelineContextActions.success({ error: '', pipeline, isUpdated: false }))
        dispatch(PipelineContextActions.initialized())
      } else if (data) {
        dispatch(
          PipelineContextActions.success({ error: '', pipeline: data?.pipeline, isUpdated: data?.isUpdated || true })
        )
        dispatch(PipelineContextActions.initialized())
      }
    } else {
      dispatch(
        PipelineContextActions.success({
          error: '',
          pipeline: data?.pipeline || DefaultPipeline,
          isUpdated: data?.isUpdated || false
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
  queryParams: GetNgPipelineByIdentifierQueryParams,
  identifier: string,
  pipeline: CDPipelineDTO
): Promise<void> => {
  const id = getId(
    queryParams.accountIdentifier,
    queryParams.orgIdentifier || '',
    queryParams.projectIdentifier || '',
    identifier
  )
  if (IdbPipeline) {
    dispatch(PipelineContextActions.updating())

    const payload: PipelinePayload = {
      [KeyPath]: id,
      pipeline,
      isUpdated: true
    }
    await IdbPipeline.put(IdbPipelineStoreName, payload)
    dispatch(PipelineContextActions.success({ error: '', pipeline, isUpdated: true }))
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
  queryParams: GetNgPipelineByIdentifierQueryParams,
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
  queryParams: GetNgPipelineByIdentifierQueryParams
  pipelineIdentifier: string
}> = ({ queryParams, pipelineIdentifier, children }) => {
  const [state, dispatch] = React.useReducer(PipelineReducer, initialState)
  state.pipelineIdentifier = pipelineIdentifier
  const fetchPipeline = _fetchPipeline.bind(null, dispatch, queryParams, pipelineIdentifier)
  const updatePipeline = _updatePipeline.bind(null, dispatch, queryParams, pipelineIdentifier)
  const pipelineSaved = React.useCallback(() => {
    dispatch(PipelineContextActions.pipelineSavedAction())
  }, [])

  const updatePipelineView = React.useCallback((data: PipelineViewData) => {
    dispatch(PipelineContextActions.updatePipelineView({ pipelineView: data }))
  }, [])

  const deletePipelineCache = _deletePipelineCache.bind(null, dispatch, queryParams, pipelineIdentifier)

  React.useEffect(() => {
    if (state.isDBInitialized) {
      fetchPipeline()
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
