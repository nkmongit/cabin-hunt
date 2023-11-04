import { useMutation } from '@tanstack/react-query';
import { addguest as guestApi } from '../../services/apiGuests';
import { toast } from 'react-hot-toast';

export function useGuest() {
  const { mutate: addguest, isLoading } = useMutation({
    mutationFn: guestApi,
    onSuccess: () => {
      toast.success('Guest Added Sucessfully');
    },
  });

  return { addguest, isLoading };
}
