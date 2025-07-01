const Spinner = ({ className = "" }) => (
  <div
    className={`animate-spin rounded-full h-6 w-6 border-t-2 border-primary ${className}`}
  ></div>
);
export default Spinner;
