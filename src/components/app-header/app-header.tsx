import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { getName } from '../../slices/UserSlice/userSlice';

export const AppHeader: FC = () => {
  const name = useSelector(getName);
  return <AppHeaderUI userName={name ? name.name : ''} />;
};
