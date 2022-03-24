import { useCallback, useState } from 'react';

interface UseDialogProps<T> {
  open: boolean;
  data?: T;
}

export interface UseDialogReturn<T> {
  isOpen: boolean;
  data: T | undefined;
  open: (newData?: T) => void;
  close: (newData?: T) => void;
  toggle: (newData?: T) => void;
}

export function useDialog<T>(
  initialState?: UseDialogProps<T>,
): UseDialogReturn<T> {
  const [isOpen, setIsOpen] = useState(initialState?.open || false);
  const [data, setData] = useState<T | undefined>(
    initialState?.data || undefined,
  );

  const open = useCallback((newData?: T) => {
    setData(newData);
    setIsOpen(true);
  }, []);

  const close = useCallback((newData?: T) => {
    setData(newData);
    setIsOpen(false);
  }, []);

  const toggle = useCallback((newData?: T) => {
    setData(newData);
    setIsOpen((prev) => !prev);
  }, []);

  return { isOpen, data, open, close, toggle };
}
