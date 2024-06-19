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
      dialogRef.current.showModal(); // or dialogRef.current.show() for non-modal
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
    <dialog ref={dialogRef}>
      <button onClick={handleClose}>CLOSE</button>
      {children}
    </dialog>
  );
};

export default DialogBox;
