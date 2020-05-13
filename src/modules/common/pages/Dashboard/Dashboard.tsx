import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { getUsers } from 'modules/common/services/UserService';

export default function Dashboard() {
  useEffect(() => {
    getUsers({ accountId: 'kmpySmUISimoRrJL6NL73w' });
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <Link to="/pipeline-studio">Pipeline Studio</Link>
    </div>
  );
}
