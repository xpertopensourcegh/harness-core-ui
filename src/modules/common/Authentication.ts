import AppStorage from 'modules/common/AppStorage';

const Authentication = {
  isAuthenticated: () => AppStorage.has('token')
};

export default Authentication;
