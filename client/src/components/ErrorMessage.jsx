import { AiOutlineExclamationCircle } from "react-icons/ai";
import PropTypes from "prop-types";

const ErrorMessage = ({ message }) => {
  return (
    <div className="flex text-sm  items-center w-full bg-red-100 text-red-700 p-4 rounded-lg">
      <AiOutlineExclamationCircle className="text-red-600 w-6 h-6 mr-3" />
      <span className="font-semibold">{message}</span>
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string,
};

export default ErrorMessage;
