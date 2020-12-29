// TODO remove this once integrate DTO

export interface CIBuildResponseDTO {
  event: string
  author?: CIBuildAuthor
  branch?: CIBuildBranchHook
  pullRequest?: CIBuildPRHook
  publishedArtifacts?: PublishedArtifact[]
}

export interface CIBuildAuthor {
  id: string
  name: string
  email: string
  avatar: string
}

export interface CIBuildBranchHook {
  name: string
  link: string
  state: string
  commits: CIBuildCommit[]
}

export interface CIBuildPRHook {
  id: string
  link: string
  title: string
  body: string
  sourceRepo: string
  sourceBranch: string
  targetBranch: string
  state: string
  commits: CIBuildCommit[]
}

export interface CIBuildCommit {
  id: string
  link: string
  message: string
  ownerName: string
  ownerId: string
  ownerEmail: string
  timeStamp: number
}

export interface PublishedArtifact {
  buildNumber: string
  buildLink: string
}
