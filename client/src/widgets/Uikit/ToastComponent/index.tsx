'use client';
import { Button } from '@/shared/ui/button';
import React from 'react';
import { toast } from 'sonner';

export const ToastCopmponent = () => {
  const handlePositiveToast = () => {
    toast.success('This is positive toast');
  };

  const handleInfoToast = () => {
    toast.info('This is info toast');
  };

  const handleErrorToast = () => {
    toast.error('This is error toast');
  };

  const handleWarningToast = () => {
    toast.warning('This is the warnning toast');
  };

  const handleLoadingToast = () => {
    toast.loading('This is the loading toast');
  };

  return (
    <div className="flex justify-center gap-10 m-5">
      <Button className="bg-positive" onClick={handlePositiveToast}>
        Positive
      </Button>
      <Button className="bg-active-border" onClick={handleInfoToast}>
        Info
      </Button>
      <Button className="bg-red" onClick={handleErrorToast}>
        Error
      </Button>
      <Button className="bg-info" onClick={handleWarningToast}>
        Warning
      </Button>
      <Button className="bg-active-border" onClick={handleLoadingToast}>
        Loading
      </Button>
    </div>
  );
};
