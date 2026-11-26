import { useUserStore } from '@services/user-service/user-service';
import { useShallow } from 'zustand/react/shallow';

export const useFullName = (): string => {
  const { firstName, lastName } = useUserStore(
    useShallow((state) => ({ firstName: state.user.firstName, lastName: state.user.lastName }))
  );
  return `${firstName} ${lastName}`.trim();
};
