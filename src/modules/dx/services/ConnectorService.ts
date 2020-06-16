import xhr from '@wings-software/xhr-async'
// import type { ServiceResponse } from 'modules/common/services/ServiceResponse'

interface CreateConnector{
    xhrGroup:string,
    connector:any
}
export function createConnector({xhrGroup,connector}:CreateConnector){
    const url=`http://localhost:7457/connectors`
   return xhr.post(url,{xhrGroup,data:connector}).as('connector')

}