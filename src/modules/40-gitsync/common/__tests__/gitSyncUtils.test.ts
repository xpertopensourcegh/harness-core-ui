import type { GitSyncConfig } from 'services/cd-ng'
import { getExternalUrl, getRepoDetailsByIndentifier } from '../gitSyncUtils'

describe('gitSyncUtils test', () => {
  describe('Test getExternalUrl method', () => {
    test('show return correct url', () => {
      const mockConfig = {
        branch: 'feature',
        repo: 'https://github.com/testing/somerepo',
        gitConnectorType: 'Github'
      } as GitSyncConfig
      const testFolderPath = 'samplefolder/.harness'
      const url = getExternalUrl(mockConfig, testFolderPath)
      expect(url).toBe(`${mockConfig.repo}/tree/${mockConfig.branch}/${testFolderPath}`)
    })
    test('empty url for no repo/url or empty branch', () => {
      const mockConfig = {
        branch: 'feature',
        repo: '',
        gitConnectorType: 'Github'
      } as GitSyncConfig
      const url = getExternalUrl(mockConfig, 'samplefolder/.harness')
      expect(url).toBe('')
    })
  })

  describe('Test getRepoDetailsByIndentifier method', () => {
    let repos: GitSyncConfig[] = []
    beforeEach(() => {
      repos = [
        {
          branch: 'feature',
          repo: 'https://github.com/testing/somerepo',
          gitConnectorType: 'Github',
          identifier: 'repo1'
        },
        {
          branch: 'feature',
          repo: 'https://github.com/testing/somerepo',
          gitConnectorType: 'Github',
          identifier: 'repo2'
        }
      ]
    })
    test('should return correct repo object', () => {
      const repoObj = getRepoDetailsByIndentifier('repo2', repos)
      expect(repoObj).toBe(repos[1])
    })
    test('should return undefined when identifier is passed as undefined', () => {
      const repoObj = getRepoDetailsByIndentifier(undefined, repos)
      expect(repoObj).toBe(undefined)
    })
  })
})
