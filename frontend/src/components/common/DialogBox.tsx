import React, { useRef, useEffect } from "react";

type DialogBoxProps = {
  children: React.ReactNode;
  dialogOpen: boolean;
  toggleVisibility: () => void;
};

const DialogBox = ({ children, dialogOpen, toggleVisibility }: DialogBoxProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (dialogOpen && dialogRef.current) {
      dialogRef.current.showModal();
    } else if (!dialogOpen && dialogRef.current) {
      dialogRef.current.close();
    }
  }, [dialogOpen]);

  const handleClose = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    toggleVisibility();
  };

  return (
    <>
      {dialogOpen && (
        <dialog ref={dialogRef} className="flex flex-col w-96 h-96 bg-slate-800 text-white">
          <button onClick={handleClose}>CLOSE</button>
          {children}
        </dialog>
      )}
    </>
  );
};

export default DialogBox;
