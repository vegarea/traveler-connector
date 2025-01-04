import React from 'react';
import { UserList } from '@/components/admin/UserList';

const Users = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Usuarios</h1>
      <UserList />
    </div>
  );
};

export default Users;