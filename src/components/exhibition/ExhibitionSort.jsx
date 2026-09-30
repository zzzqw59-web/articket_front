import "../../styles/ExhibitionAndVenue.css";

const ExhibitionSort = ({ value, onChange }) => {
    return (
        <div className="exhibition-sort">

            <span>
                정렬
            </span>

            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >

                <option value="latest">
                   최신순 
                </option>
                <option value="oldest">
                   오래된 순    
                </option>    
            </select>    
        </div>
    );
};
export default ExhibitionSort;