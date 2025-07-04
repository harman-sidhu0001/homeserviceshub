import CustomButton from "../common/Button";

const LoginModal = ({ show, onHide, handleLogin }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <div className="text-xl font-bold mb-2">Login First</div>
        <div className="mb-6">
          Sorry for intrusion but you have to register first
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
            onClick={onHide}
          >
            Close
          </button>
          <CustomButton onClick={handleLogin} text={"Register/Login"} />
        </div>
      </div>
    </div>
  );
};
export default LoginModal;
