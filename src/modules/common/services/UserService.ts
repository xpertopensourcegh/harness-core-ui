import xhr from '@wings-software/xhr-async';
import AppStorage from 'modules/common/AppStorage';

///////////////// This section needs to move out //////////////////
interface CustomWindow extends Window {
  apiUrl?: string;
}

const {
  location: { protocol, hostname }
} = window as CustomWindow;

xhr.defaults.baseURL = `${protocol}//${hostname}:9090/api`; // getApiBaseUrl();

xhr.before(({ headers }) => {
  if (AppStorage.get('token') && headers) {
    headers.authorization = 'Bearer ' + AppStorage.get('token');
  }
});
/////////////////////////////////////////////////////////////////

export function getUsers({ accountId }: { accountId: string }): unknown {
  return xhr.get(`users?accountId=${accountId}`);
}
