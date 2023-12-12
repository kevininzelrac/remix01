export default function Dialog({
  children,
  handleClose,
}: {
  children: any;
  handleClose: () => void;
}) {
  return (
    <dialog>
      <div className="opaque" onClick={handleClose}></div>
      <div>
        <button className="close" onClick={handleClose}>
          x
        </button>
        {children}
      </div>
    </dialog>
  );
}
