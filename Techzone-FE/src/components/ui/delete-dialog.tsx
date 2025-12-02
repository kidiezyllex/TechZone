"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mdiAlert, mdiDelete, mdiLoading } from "@mdi/js";
import Icon from "@mdi/react";
import { toast } from "react-toastify";

interface DeleteDialogProps {
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<any>;
  title: string;
  description: string;
  confirmText: string;
  successMessage: string;
  errorMessage: string;
  warningMessage?: string;
}

export const DeleteDialog = ({
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  successMessage,
  errorMessage,
  warningMessage,
}: DeleteDialogProps) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      toast.success(successMessage);
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || errorMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-mainTextV1">{title}</DialogTitle>
        </DialogHeader>

        {warningMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Icon path={mdiAlert} size={1.1} className="text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <p className="font-semibold mb-1">Warning:</p>
                <p>{warningMessage}</p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 !bg-transparent"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1"
          >
            {isDeleting ? (
              <>
                <Icon path={mdiLoading} size={0.8} className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Icon path={mdiDelete} size={0.8} />
                {confirmText}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 