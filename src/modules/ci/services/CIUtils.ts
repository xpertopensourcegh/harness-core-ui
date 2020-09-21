/** return last 6 characters from commit id */
export function getShortCommitId(commitId: string): string {
  return commitId.slice(-6)
}
