const AuthCard = ({ title, description, children, maxWidth = "max-w-2xl" }) => {
  return (
    <section className="w-full px-4 py-14 flex justify-center">
      <div
        className={`w-full ${maxWidth} bg-white border border-gray-100 rounded-xl shadow-sm px-6 py-8 sm:px-10`}
      >
        <div className="mb-8">
          <h1 className="head-text text-3xl font-bold text-gray-900 tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="head-text mt-2 text-sm text-gray-500 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
};

export default AuthCard;
