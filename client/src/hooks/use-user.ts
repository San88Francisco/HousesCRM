import { tokenStorage } from '@/shared/utils/auth/token';
import { RootState } from '@/store/store';
import { setUser } from '@/store/user-slice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useUser = () => {
  const dispatch = useDispatch();
  const userEmail = useSelector((state: RootState) => state.user.email);

  useEffect(() => {
    if (!userEmail) {
      const userData = tokenStorage.getUserData();
      if (userData?.email) {
        dispatch(setUser(userData));
      }
    }
  }, [dispatch, userEmail]);

  return {
    email: userEmail,
  };
};
