import { useEffect, useState } from "react";
import {useNavigate,useParams} from "react-router-dom";
import {getExhibitionDetail,updateExhibition} from "../../api/exhibitionApi";
import "../../styles/ExhibitionAndVenue.css";
import MainLayout from "../../layouts/MainLayout";

const ExhibitionEditPage = ({ user }) => {
  const { exhibitionId } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    url: "",
    area: "",
    price: "",
    ticketPrice: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const [image, setImage] = useState(null);

  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === "ADMIN";

  const isStaff = user?.role === "STAFF";

  useEffect(() => {
    // 관리자 + 전시 관계자 수정 가능 나중에 !isAdmin으로 변경
    if (isAdmin || isStaff) {
      alert(
        "수정 권한이 없습니다."
      );

      navigate(
        `/articket/exhibition/${exhibitionId}`
      );

      return;
    }

    const fetchDetail = async () => {
      try {
        const data =
          await getExhibitionDetail(
            exhibitionId
          );

        setForm({
          title: data.title || "",
          url: data.url || "",
          area: data.area || "",
          price: data.price || "",
          ticketPrice:
            data.ticketPrice || "",
          description:
            data.description || "",
          startDate:
            data.startDate || "",
          endDate:
            data.endDate || "",
        });

        setPreview(
          data.imgUrl ? data.imgUrl.startsWith("http") 
          ? data.imgUrl 
          : `http://localhost:8080/api/images/${data.imgUrl}` : ""
        );

      } catch (error) {
        console.error(error);

        alert(
          "전시 정보를 불러오지 못했습니다."
        );

        navigate(
          `/articket/exhibition/${exhibitionId}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();

  }, [
    exhibitionId,
    isAdmin,
    navigate,
  ]);

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    setImage(file);

    const imageUrl =
      URL.createObjectURL(file);

    setPreview(imageUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateExhibition(
        exhibitionId,
        form,
        image
      );

      alert(
        "수정되었습니다."
      );

      navigate(
        `/articket/exhibition/${exhibitionId}`
      );

    } catch (error) {
      console.error(error);

      alert(
        "수정에 실패했습니다."
      );
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  // 이것도 나중에 !isAdmin으로 바꿔주기  
  if (isAdmin) {
    return null;
  }

  return (
    <div className="exhibition-edit-page">

      <h1>전시 수정</h1>

      <form onSubmit={handleSubmit}>

        {/* 이미지 */}
        <div className="image-area">

          {preview && (
            <img
              src={preview}
              alt="미리보기"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={
              handleImageChange
            }
          />

        </div>

        {/* 입력 영역 */}
        <div className="form-area">

          <div>
            <label>
              전시명
            </label>

            <input
              name="title"
              value={form.title}
              onChange={
                handleChange
              }
            />
          </div>

          <div>
            <label>
              시작일
            </label>

            <input
              type="date"
              name="startDate"
              value={
                form.startDate
              }
              onChange={
                handleChange
              }
            />
          </div>

          <div>
            <label>
              종료일
            </label>

            <input
              type="date"
              name="endDate"
              value={
                form.endDate
              }
              onChange={
                handleChange
              }
            />
          </div>

          <div>
            <label>
              지역
            </label>

            <input
              name="area"
              value={form.area}
              onChange={
                handleChange
              }
            />
          </div>

          <div>
            <label>
              가격
            </label>

            <input
              name="price"
              value={form.price}
              onChange={
                handleChange
              }
            />
          </div>

          <div>
            <label>
              티켓 가격
            </label>

            <input
              name="ticketPrice"
              value={
                form.ticketPrice
              }
              onChange={
                handleChange
              }
            />
          </div>

          <div>
            <label>
              홈페이지
            </label>

            <input
              name="url"
              value={form.url}
              onChange={
                handleChange
              }
            />
          </div>

          <div>
            <label>
              설명
            </label>

            <textarea
              name="description"
              value={
                form.description
              }
              onChange={
                handleChange
              }
            />
          </div>

        </div>

        {/* 버튼 */}
        <div className="button-area">

          <button type="submit">
            수정
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                `/articket/exhibition/${exhibitionId}`
              )
            }
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExhibitionEditPage;