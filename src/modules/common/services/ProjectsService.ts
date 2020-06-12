import xhr from '@wings-software/xhr-async'
import type { ResponseWrapper } from 'modules/common/utils/HelperTypes'
// import type { ProjectDTO } from '@wings-software/swagger-ts/definitions'
// TODO replace with actual swagger type
import type { ProjectDTO } from 'modules/common/pages/ProjectsPage/views/ProjectCard/ProjectCard'

export function getProjects(): Promise<ResponseWrapper<ProjectDTO[]>> {
  return xhr.get('/cd/api/projects?organizationId=123')
}

export function createProject(config: ProjectDTO): Promise<ResponseWrapper<ProjectDTO>> {
  delete config.color
  config['accountId'] = localStorage.getItem('acctId') || ''
  config['owners'] = [config['accountId']]
  return xhr.post('/cd/api/projects', { data: config })
}
