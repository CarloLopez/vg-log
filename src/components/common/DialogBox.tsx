import React from "react";
import { useRef, useEffect } from "react";

type DialogBoxProps = {
  children: React.ReactNode;
  dialogOpen: boolean;
  toggleVisibility : () => void;
}

const DialogBox = ({children, dialogOpen, toggleVisibility}: DialogBoxProps) => {

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (dialogOpen && dialogRef.current) {
      dialogRef.current.showModal(); // or dialogRef.current.show() for non-modal
    }
  }, [dialogOpen]);

  return (
    <dialog ref={dialogRef}>
      <button onClick={toggleVisibility}>CLOSE</button>
      {children}
    </dialog>
  )
}

export default DialogBox;