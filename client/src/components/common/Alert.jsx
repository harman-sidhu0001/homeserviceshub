const Alert = ({ type, children }) => (
  <div
    className={`p-4 rounded-md ${
      type === "error" ? "bg-error/10 text-error" : "bg-success/10 text-success"
    }`}
  >
    {children}
  </div>
);

export default Alert;
