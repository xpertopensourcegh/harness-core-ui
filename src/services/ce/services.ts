export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
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
          monthlyCost: number
          monthlySaving: number
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
  /** Long type */
  Long: any
  /** Built-in scalar for map-like structures */
  Map_String_ContainerRecommendationScalar: any
  /** Built-in scalar representing a date-time with a UTC offset */
  OffsetDateTime: any
  /** Built-in scalar representing a time with a UTC offset */
  OffsetTime: any
  /** Use SPQR's SchemaPrinter to remove this from SDL */
  UNREPRESENTABLE: any
}

/** This union of all types of recommendations */
export type RecommendationDetails = NodeRecommendationDto | WorkloadRecommendationDto

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
  cpuHistogram: Maybe<HistogramExp>
  memoryHistogram: Maybe<HistogramExp>
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
  limit: Maybe<Scalars['Long']>
  minCost: Maybe<Scalars['Float']>
  minSaving: Maybe<Scalars['Float']>
  name: Maybe<Scalars['String']>
  namespace: Maybe<Scalars['String']>
  offset: Maybe<Scalars['Long']>
  resourceType: Maybe<ResourceType>
}

export type RecommendationItemDto = {
  __typename?: 'RecommendationItemDTO'
  clusterName: Maybe<Scalars['String']>
  id: Scalars['String']
  monthlyCost: Scalars['Float']
  monthlySaving: Scalars['Float']
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

export type WorkloadRecommendationDto = {
  __typename?: 'WorkloadRecommendationDTO'
  containerRecommendations: Maybe<Scalars['Map_String_ContainerRecommendationScalar']>
  items: Maybe<Array<Maybe<ContainerHistogramDto>>>
}

export enum ResourceType {
  Node = 'NODE',
  Workload = 'WORKLOAD'
}
