import { getStaffPageAsk } from "../../api/askApi";
import { getStaffPageReview } from "../../api/reviewApi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StaffList from "./StaffList";

const ListBoard = ({ selectedExhibitions = [] }) => {
  const navigate = useNavigate();

  const [askItems, setAskItems] = useState([]);
  const [reviewItems, setReviewItems] = useState([]);

  const [askPage, setAskPage] = useState(0);
  const [reviewPage, setReviewPage] = useState(0);

  const [askTotalPages, setAskTotalPages] = useState(1);
  const [reviewTotalPages, setReviewTotalPages] = useState(1);

  const [currentIndex, setCurrentIndex] = useState(0);

  const currentExhibition = selectedExhibitions[currentIndex];
  const exhibitionId = currentExhibition?.id;

  const handleAskClick = (item) => {
    navigate(`/articket/ask/${item.askId}`);
  };

  const handleReviewClick = (item) => {
    navigate(`/articket/review/${item.reviewId}`);
  };

  useEffect(() => {
    setCurrentIndex(0);
    setAskPage(0);
    setReviewPage(0);
  }, [selectedExhibitions]);

  // 문의글 조회
  useEffect(() => {
    if (!exhibitionId) {
      setAskItems([]);
      setAskTotalPages(1);
      return;
    }

    let cancelled = false;

    const fetchAskList = async () => {
      try {
        const data = await getStaffPageAsk(exhibitionId, {
          page: askPage + 1,
          size: 5,
        });

        if (cancelled) return;

        setAskItems(data.dtoList ?? []);
        setAskTotalPages(Math.max(1, Number(data.totalPage) || 1));
      } catch (error) {
        if (cancelled) return;

        setAskItems([]);
        setAskTotalPages(1);
      }
    };

    fetchAskList();

    return () => {
      cancelled = true;
    };
  }, [exhibitionId, askPage]);

  // 리뷰글 조회
  useEffect(() => {
    if (!exhibitionId) {
      setReviewItems([]);
      setReviewTotalPages(1);
      return;
    }

    let cancelled = false;

    const fetchReviewList = async () => {
      try {
        const data = await getStaffPageReview(exhibitionId, {
          page: reviewPage + 1,
          size: 5,
        });

        if (cancelled) return;

        setReviewItems(data.dtoList ?? []);
        setReviewTotalPages(Math.max(1, Number(data.totalPage) || 1));
      } catch (error) {
        if (cancelled) return;

        setReviewItems([]);
        setReviewTotalPages(1);
      }
    };

    fetchReviewList();

    return () => {
      cancelled = true;
    };
  }, [exhibitionId, reviewPage]);

  // 전시 이동
  const changeExhibition = (direction) => {
    const count = selectedExhibitions.length;
    if (count === 0) return;

    const nextIndex = currentIndex + direction;

    // 양 끝에서는 이동하지 않음
    if (nextIndex < 0 || nextIndex >= count) return;

    setCurrentIndex(nextIndex);
    setAskPage(0);
    setReviewPage(0);
  };

  return (
    <div className="mx-auto w-[1400px]">
      <div className=" items-center">
        <h2 className="head-text text-4xl font-bold mt-10 mb-5">
          관련 글 조회
        </h2>

        {currentExhibition && (
          <div className="flex justify-between">
            <div className="head-text text-2xl ml-3 -translate-x-2">
              현재 전시 : {currentExhibition.title}
            </div>
            <button
              type="button"
              onClick={() =>
                navigate(`/articket/exhibition/${currentExhibition.id}`)
              }
              className="mb-5 rounded-2xl border-2 border-gray-500 px-3 py-1 text-gray-500 transition hover:bg-gray-600 hover:text-white"
            >
              전시 소개 바로가기
            </button>
          </div>
        )}
      </div>

      <div className="flex items-start gap-15">
        <StaffList
          title="문의글"
          items={askItems}
          idKey="askId"
          titleKey="askTitle"
          dateKey="askCreatedAt"
          page={askPage}
          totalPages={askTotalPages}
          onPageChange={setAskPage}
          onItemClick={handleAskClick}
        />

        <StaffList
          title="리뷰글"
          items={reviewItems}
          idKey="reviewId"
          titleKey="reviewTitle"
          dateKey="reviewCreatedAt"
          page={reviewPage}
          totalPages={reviewTotalPages}
          onPageChange={setReviewPage}
          onItemClick={handleReviewClick}
        />
      </div>

      {selectedExhibitions.length > 0 && (
        <div className="mt-5 flex items-center justify-center">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => changeExhibition(-1)}
              disabled={currentIndex === 0}
              aria-label="이전 전시"
              className="rounded-full border border-gray-300 p-2 disabled:opacity-30"
            >
              ←
            </button>

            <span className="min-w-[90px] text-center text-sm text-gray-600">
              {currentIndex + 1} / {selectedExhibitions.length}
            </span>

            <button
              type="button"
              onClick={() => changeExhibition(1)}
              disabled={currentIndex === selectedExhibitions.length - 1}
              aria-label="다음 전시"
              className="rounded-full border border-gray-300 p-2 disabled:opacity-30"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListBoard;
