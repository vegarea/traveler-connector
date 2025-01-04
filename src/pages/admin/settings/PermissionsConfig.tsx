import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PermissionsConfig = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/admin/settings/wordpress');
  }, [navigate]);

  return null;
};

export default PermissionsConfig;