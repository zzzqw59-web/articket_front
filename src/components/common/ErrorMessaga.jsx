const ErrorMessage = ({message = "데이터를 불러오지 못했습니다."}) => {

    return (
        <div className="error-message">
            {message}
        </div>
    );
};
export default ErrorMessage;