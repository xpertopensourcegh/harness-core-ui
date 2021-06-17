import gql from 'graphql-tag'
import * as Urql from 'urql'
export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export const RecommendationsDocument = gql`
  query Recommendations {
    recommendationStats {
      totalMonthlyCost
      totalMonthlySaving
    }
    recommendations {
      items {
        id
        resourceType
        resourceName
        monthlyCost
        monthlySaving
      }
    }
  }
`

export function useRecommendationsQuery(options: Omit<Urql.UseQueryArgs<RecommendationsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<RecommendationsQuery>({ query: RecommendationsDocument, ...options })
}
export const FetchRecommendationDocument = gql`
  query FetchRecommendation($id: String!) {
    recommendationStats(id: $id) {
      totalMonthlyCost
      totalMonthlySaving
    }
    recommendationDetails(id: $id, resourceType: WORKLOAD) {
      ... on WorkloadRecommendationDTO {
        containerRecommendations
        items {
          containerName
          cpuHistogram {
            bucketWeights
            firstBucketSize
            growthRatio
            maxBucket
            minBucket
            numBuckets
            precomputed
            totalWeight
          }
          memoryHistogram {
            bucketWeights
            firstBucketSize
            growthRatio
            maxBucket
            minBucket
            numBuckets
            precomputed
            totalWeight
          }
        }
      }
    }
  }
`

export function useFetchRecommendationQuery(
  options: Omit<Urql.UseQueryArgs<FetchRecommendationQueryVariables>, 'query'> = {}
) {
  return Urql.useQuery<FetchRecommendationQuery>({ query: FetchRecommendationDocument, ...options })
}
export type RecommendationsQueryVariables = Exact<{ [key: string]: never }>

export type RecommendationsQuery = {
  __typename?: 'Query'
  recommendationStats: Maybe<{
    __typename?: 'RecommendationOverviewStats'
    totalMonthlyCost: number
    totalMonthlySaving: number
  }>
  recommendations: Maybe<{
    __typename?: 'RecommendationsDTO'
    items: Maybe<
      Array<
        Maybe<{
          __typename?: 'RecommendationItemDTO'
          id: string
          resourceType: ResourceType
          resourceName: Maybe<string>
          monthlyCost: Maybe<number>
          monthlySaving: Maybe<number>
        }>
      >
    >
  }>
}

export type FetchRecommendationQueryVariables = Exact<{
  id: Scalars['String']
}>

export type FetchRecommendationQuery = {
  __typename?: 'Query'
  recommendationStats: Maybe<{
    __typename?: 'RecommendationOverviewStats'
    totalMonthlyCost: number
    totalMonthlySaving: number
  }>
  recommendationDetails: Maybe<
    | { __typename?: 'NodeRecommendationDTO' }
    | {
        __typename?: 'WorkloadRecommendationDTO'
        containerRecommendations: Maybe<any>
        items: Maybe<
          Array<
            Maybe<{
              __typename?: 'ContainerHistogramDTO'
              containerName: Maybe<string>
              cpuHistogram: Maybe<{
                __typename?: 'HistogramExp'
                bucketWeights: Maybe<Array<Maybe<number>>>
                firstBucketSize: number
                growthRatio: number
                maxBucket: number
                minBucket: number
                numBuckets: number
                precomputed: Maybe<Array<Maybe<number>>>
                totalWeight: number
              }>
              memoryHistogram: Maybe<{
                __typename?: 'HistogramExp'
                bucketWeights: Maybe<Array<Maybe<number>>>
                firstBucketSize: number
                growthRatio: number
                maxBucket: number
                minBucket: number
                numBuckets: number
                precomputed: Maybe<Array<Maybe<number>>>
                totalWeight: number
              }>
            }>
          >
        >
      }
  >
}

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** Built-in java.math.BigDecimal */
  BigDecimal: any
  /** Long type */
  Long: any
  /** Built-in scalar for map-like structures */
  Map_String_ContainerRecommendationScalar: any
  /** Built-in scalar for map-like structures */
  Map_String_ResourceRequirementScalar: any
  /** Built-in scalar for map-like structures */
  Map_String_StringScalar: any
  /** Built-in scalar representing a date-time with a UTC offset */
  OffsetDateTime: any
  /** Built-in scalar representing a time with a UTC offset */
  OffsetTime: any
  /** Use SPQR's SchemaPrinter to remove this from SDL */
  UNREPRESENTABLE: any
}

/** This union of all types of recommendations */
export type RecommendationDetails = NodeRecommendationDto | WorkloadRecommendationDto

export type BillingData = {
  __typename?: 'BillingData'
  accountid: Maybe<Scalars['String']>
  actualidlecost: Maybe<Scalars['Float']>
  appid: Maybe<Scalars['String']>
  avgcpuutilization: Maybe<Scalars['Float']>
  avgcpuutilizationvalue: Maybe<Scalars['Float']>
  avgmemoryutilization: Maybe<Scalars['Float']>
  avgmemoryutilizationvalue: Maybe<Scalars['Float']>
  billingaccountid: Maybe<Scalars['String']>
  billingamount: Maybe<Scalars['Float']>
  cloudprovider: Maybe<Scalars['String']>
  cloudproviderid: Maybe<Scalars['String']>
  cloudservicename: Maybe<Scalars['String']>
  clusterid: Maybe<Scalars['String']>
  clustername: Maybe<Scalars['String']>
  clustertype: Maybe<Scalars['String']>
  cpuactualidlecost: Maybe<Scalars['Float']>
  cpubillingamount: Maybe<Scalars['Float']>
  cpuidlecost: Maybe<Scalars['Float']>
  cpulimit: Maybe<Scalars['Float']>
  cpurequest: Maybe<Scalars['Float']>
  cpusystemcost: Maybe<Scalars['Float']>
  cpuunallocatedcost: Maybe<Scalars['Float']>
  cpuunitseconds: Maybe<Scalars['Float']>
  endtime: Maybe<Scalars['OffsetDateTime']>
  envid: Maybe<Scalars['String']>
  idlecost: Maybe<Scalars['Float']>
  instanceid: Maybe<Scalars['String']>
  instancename: Maybe<Scalars['String']>
  instancetype: Maybe<Scalars['String']>
  launchtype: Maybe<Scalars['String']>
  maxcpuutilization: Maybe<Scalars['Float']>
  maxcpuutilizationvalue: Maybe<Scalars['Float']>
  maxmemoryutilization: Maybe<Scalars['Float']>
  maxmemoryutilizationvalue: Maybe<Scalars['Float']>
  memoryactualidlecost: Maybe<Scalars['Float']>
  memorybillingamount: Maybe<Scalars['Float']>
  memoryidlecost: Maybe<Scalars['Float']>
  memorylimit: Maybe<Scalars['Float']>
  memorymbseconds: Maybe<Scalars['Float']>
  memoryrequest: Maybe<Scalars['Float']>
  memorysystemcost: Maybe<Scalars['Float']>
  memoryunallocatedcost: Maybe<Scalars['Float']>
  namespace: Maybe<Scalars['String']>
  networkcost: Maybe<Scalars['Float']>
  parentinstanceid: Maybe<Scalars['String']>
  pricingsource: Maybe<Scalars['String']>
  region: Maybe<Scalars['String']>
  serviceid: Maybe<Scalars['String']>
  settingid: Maybe<Scalars['String']>
  starttime: Maybe<Scalars['OffsetDateTime']>
  storageactualidlecost: Maybe<Scalars['Float']>
  storagecost: Maybe<Scalars['Float']>
  storagembseconds: Maybe<Scalars['Float']>
  storagerequest: Maybe<Scalars['Float']>
  storageunallocatedcost: Maybe<Scalars['Float']>
  storageutilizationvalue: Maybe<Scalars['Float']>
  systemcost: Maybe<Scalars['Float']>
  taskid: Maybe<Scalars['String']>
  unallocatedcost: Maybe<Scalars['Float']>
  usagedurationseconds: Maybe<Scalars['Float']>
  workloadname: Maybe<Scalars['String']>
  workloadtype: Maybe<Scalars['String']>
}

export type BillingDataDemo = {
  __typename?: 'BillingDataDemo'
  billingamount: Maybe<Scalars['Float']>
  instancedata: Maybe<InstanceDataDemo>
  instanceid: Maybe<Scalars['String']>
  instancename: Maybe<Scalars['String']>
  starttime: Maybe<Scalars['Long']>
}

export type ContainerHistogramDto = {
  __typename?: 'ContainerHistogramDTO'
  containerName: Maybe<Scalars['String']>
  containerRecommendation: Maybe<ContainerRecommendation>
  cpuHistogram: Maybe<HistogramExp>
  memoryHistogram: Maybe<HistogramExp>
}

export type ContainerRecommendation = {
  __typename?: 'ContainerRecommendation'
  burstable: Maybe<ResourceRequirement>
  current: Maybe<ResourceRequirement>
  guaranteed: Maybe<ResourceRequirement>
  lastDayCost: Maybe<Cost>
  numDays: Scalars['Int']
  percentileBased: Maybe<Scalars['Map_String_ResourceRequirementScalar']>
  recommended: Maybe<ResourceRequirement>
  totalSamplesCount: Scalars['Int']
}

export type Cost = {
  __typename?: 'Cost'
  cpu: Maybe<Scalars['BigDecimal']>
  memory: Maybe<Scalars['BigDecimal']>
}

export type HistogramExp = {
  __typename?: 'HistogramExp'
  bucketWeights: Maybe<Array<Maybe<Scalars['Float']>>>
  firstBucketSize: Scalars['Float']
  growthRatio: Scalars['Float']
  maxBucket: Scalars['Int']
  minBucket: Scalars['Int']
  numBuckets: Scalars['Int']
  precomputed: Maybe<Array<Maybe<Scalars['Float']>>>
  totalWeight: Scalars['Float']
}

export type InstanceDataDemo = {
  __typename?: 'InstanceDataDemo'
  cloudprovider: Maybe<Scalars['String']>
  instancetype: Maybe<Scalars['String']>
  region: Maybe<Scalars['String']>
}

export type NodeRecommendationDto = {
  __typename?: 'NodeRecommendationDTO'
  id: Maybe<Scalars['String']>
}

/** Query root */
export type Query = {
  __typename?: 'Query'
  billingData: Maybe<Array<Maybe<BillingData>>>
  billingdata: Maybe<Array<Maybe<BillingDataDemo>>>
  instancedata: Maybe<InstanceDataDemo>
  /** recommendation details/drillDown */
  recommendationDetails: Maybe<RecommendationDetails>
  /** top panel stats API */
  recommendationStats: Maybe<RecommendationOverviewStats>
  /** the list of all types of recommendations for overview page */
  recommendations: Maybe<RecommendationsDto>
}

/** Query root */
export type QueryBillingDataArgs = {
  request: Maybe<GridRequestInput>
}

/** Query root */
export type QueryBillingdataArgs = {
  clusterid: Maybe<Scalars['String']>
  endTime: Maybe<Scalars['OffsetTime']>
  startTime: Maybe<Scalars['OffsetTime']>
}

/** Query root */
export type QueryInstancedataArgs = {
  instanceid: Scalars['String']
}

/** Query root */
export type QueryRecommendationDetailsArgs = {
  endTime: Maybe<Scalars['OffsetDateTime']>
  id: Scalars['String']
  resourceType: ResourceType
  startTime: Maybe<Scalars['OffsetDateTime']>
}

/** Query root */
export type QueryRecommendationStatsArgs = {
  clusterName: Maybe<Scalars['String']>
  id: Maybe<Scalars['String']>
  minCost: Maybe<Scalars['Float']>
  minSaving: Maybe<Scalars['Float']>
  name: Maybe<Scalars['String']>
  namespace: Maybe<Scalars['String']>
  resourceType: Maybe<ResourceType>
}

/** Query root */
export type QueryRecommendationsArgs = {
  clusterName: Maybe<Scalars['String']>
  id: Maybe<Scalars['String']>
  limit?: Maybe<Scalars['Long']>
  minCost: Maybe<Scalars['Float']>
  minSaving: Maybe<Scalars['Float']>
  name: Maybe<Scalars['String']>
  namespace: Maybe<Scalars['String']>
  offset?: Maybe<Scalars['Long']>
  resourceType: Maybe<ResourceType>
}

export type RecommendationItemDto = {
  __typename?: 'RecommendationItemDTO'
  clusterName: Maybe<Scalars['String']>
  id: Scalars['String']
  monthlyCost: Maybe<Scalars['Float']>
  monthlySaving: Maybe<Scalars['Float']>
  /** recommendation details/drillDown */
  recommendationDetails: Maybe<RecommendationDetails>
  resourceName: Maybe<Scalars['String']>
  resourceType: ResourceType
}

export type RecommendationItemDtoRecommendationDetailsArgs = {
  endTime: Maybe<Scalars['OffsetDateTime']>
  startTime: Maybe<Scalars['OffsetDateTime']>
}

export type RecommendationOverviewStats = {
  __typename?: 'RecommendationOverviewStats'
  totalMonthlyCost: Scalars['Float']
  totalMonthlySaving: Scalars['Float']
}

export type RecommendationsDto = {
  __typename?: 'RecommendationsDTO'
  items: Maybe<Array<Maybe<RecommendationItemDto>>>
  limit: Scalars['Long']
  offset: Scalars['Long']
}

export type ResourceRequirement = {
  __typename?: 'ResourceRequirement'
  CPU: Maybe<Scalars['String']>
  MEMORY: Maybe<Scalars['String']>
  empty: Scalars['Boolean']
  limits: Maybe<Scalars['Map_String_StringScalar']>
  requests: Maybe<Scalars['Map_String_StringScalar']>
}

export type WorkloadRecommendationDto = {
  __typename?: 'WorkloadRecommendationDTO'
  /**
   * use items.containerRecommendation
   * @deprecated Field no longer supported
   */
  containerRecommendations: Maybe<Scalars['Map_String_ContainerRecommendationScalar']>
  items: Maybe<Array<Maybe<ContainerHistogramDto>>>
  lastDayCost: Maybe<Cost>
}

export enum AggregationOperation {
  Avg = 'AVG',
  Count = 'COUNT',
  Max = 'MAX',
  Min = 'MIN',
  Sum = 'SUM'
}

export enum FilterOperator {
  Equals = 'EQUALS',
  GreaterOrEquals = 'GREATER_OR_EQUALS',
  In = 'IN',
  LessOrEquals = 'LESS_OR_EQUALS',
  Like = 'LIKE',
  NotEquals = 'NOT_EQUALS',
  NotIn = 'NOT_IN',
  NotNull = 'NOT_NULL',
  TimeAfter = 'TIME_AFTER',
  TimeBefore = 'TIME_BEFORE'
}

export enum ResourceType {
  Node = 'NODE',
  Workload = 'WORKLOAD'
}

export enum SortOrder {
  Asc = 'ASC',
  Ascending = 'ASCENDING',
  Desc = 'DESC',
  Descending = 'DESCENDING'
}

export type FieldAggregationInput = {
  field: Maybe<Scalars['String']>
  operation: Maybe<AggregationOperation>
}

export type FieldFilterInput = {
  field: Maybe<Scalars['String']>
  operator: Maybe<FilterOperator>
  values: Maybe<Array<Maybe<Scalars['String']>>>
}

export type GridRequestInput = {
  aggregate: Maybe<Array<Maybe<FieldAggregationInput>>>
  entity: Maybe<Scalars['String']>
  groupBy: Maybe<Array<Maybe<Scalars['String']>>>
  having: Maybe<Array<Maybe<FieldFilterInput>>>
  limit: Maybe<Scalars['Int']>
  offset: Maybe<Scalars['Int']>
  orderBy: Maybe<Array<Maybe<SortCriteriaInput>>>
  where: Maybe<Array<Maybe<FieldFilterInput>>>
}

export type SortCriteriaInput = {
  field: Maybe<Scalars['String']>
  order: Maybe<SortOrder>
}
