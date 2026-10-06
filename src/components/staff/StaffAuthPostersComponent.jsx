const StaffAuthPostersComponent = ({ data, onSelect }) => {
  return (
    <div className="flex gap-4 justify-center">
      {data.map((poster) => (
        <div
          key={poster.id}
          onClick={() => onSelect(poster.id)}
          className="w-50 h-80 mt-2 mb-7 overflow-hidden"
        >
          <img
            src={poster.imgUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};

export default StaffAuthPostersComponent;
