export default function Modal({
  children,
  setRenderModal,
}: {
  children: React.ReactNode;
  setRenderModal: React.Dispatch<
    React.SetStateAction<"login" | "signup" | null>
  >;
}) {
  const handleClick = () => {
    setRenderModal(null);
  };
  return (
    <div onClick={handleClick} className="modal">
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </div>
    </div>
  );
}
