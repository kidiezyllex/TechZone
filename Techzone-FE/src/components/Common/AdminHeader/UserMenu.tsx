'use client';

import { mdiLogout } from '@mdi/js';
import Icon from '@mdi/react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/useUserContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UserMenu() {
  const { logoutUser } = useUser();
  const navigate = useNavigate();
  const handleLogout = () => {
    logoutUser();
    toast.success('Đăng xuất thành công');
    navigate('/auth/login');
  };

  return (
    <Button onClick={handleLogout} variant="outline" className="text-red-600 border-red-600 !bg-red-50">
      <Icon path={mdiLogout} size={0.8} className="mr-2 text-red-600" />
      <span className='text-red-600'>Đăng xuất</span>
    </Button>
  );
} 