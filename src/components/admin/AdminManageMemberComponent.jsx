import { useCallback, useEffect, useState } from "react";
import {
  getMembers,
  patchDeactivateMember,
  patchActivateMember,
} from "../../api/staffApi";

const PAGE_SIZE = 5;

const MEMBER_TYPE_LABEL = {
  MEMBER: "일반 회원",
  STAFF: "관계자",
  ADMIN: "관리자",
};

const DEACTIVATE_TERMS = [
  { value: 3, label: "3일" },
  { value: 7, label: "7일" },
  { value: 30, label: "30일" },
  { value: 0, label: "영구" },
];

// 회원 이름 마스킹
const maskName = (name) => {
  if (!name) return "-";
  if (name.length <= 2) return `${name[0]}*`;

  return name[0] + "*".repeat(name.length - 2) + name.slice(-1);
};

// 전화번호 마스킹
const maskPhone = (phone) => {
  if (!phone) return "-";

  return phone.replace(/-(\d{3,4})-/, "-****-");
};

// 가입일 포맷
const formatDate = (date) => {
  if (!date) return "-";

  return String(date).replace("T", " ").slice(0, 16);
};

// 회원 유형 뱃지 스타일
const getMemberTypeClass = (memberType) => {
  switch (memberType) {
    case "ADMIN":
      return "bg-red-50 text-red-700";
    case "STAFF":
      return "bg-emerald-50 text-emerald-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const AdminManageMemberComponent = () => {
  const [members, setMembers] = useState([]);
  const [page, setPage] = useState(1);
  const [pageData, setPageData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 비활성화 모달 상태
  const [deactivateTarget, setDeactivateTarget] = useState(null);
  const [deactivateReason, setDeactivateReason] = useState("");
  const [deactivateTerm, setDeactivateTerm] = useState(1);

  // 현재 처리 중인 회원 ID
  const [processingIds, setProcessingIds] = useState([]);

  // 처리 중인 회원 등록
  const startProcessing = (memberId) => {
    setProcessingIds((prev) =>
      prev.includes(memberId) ? prev : [...prev, memberId],
    );
  };

  // 처리 완료된 회원 등록 해제
  const finishProcessing = (memberId) => {
    setProcessingIds((prev) => prev.filter((id) => id !== memberId));
  };

  // 회원 목록 조회
  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getMembers(page, PAGE_SIZE);

      setMembers(data.dtoList ?? []);
      setPageData(data);
    } catch (err) {
      console.error("회원 목록 조회 실패:", err);
      setError("회원 목록을 불러오지 못했습니다.");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // 페이지네이션
  const pageNumberList = pageData.pageNumberList ?? [1];

  const totalPages = Math.max(
    1,
    pageNumberList.length > 0 ? Math.max(...pageNumberList) : 1,
  );

  const changePage = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page || loading) {
      return;
    }

    setPage(nextPage);
  };

  // 비활성화 모달 초기화
  const closeDeactivateModal = () => {
    if (deactivateTarget && processingIds.includes(deactivateTarget.memberId)) {
      return;
    }

    setDeactivateTarget(null);
    setDeactivateReason("");
    setDeactivateTerm(1);
  };

  // 회원 활성화 / 비활성화 분기
  const handleToggleStatus = async (member) => {
    const { memberId, memberStatus, memberType } = member;

    // 관리자 계정은 상태 변경 불가
    if (memberType === "ADMIN") return;

    // 중복 요청 방지
    if (processingIds.includes(memberId)) return;

    // 활성 회원이면 비활성화 모달 열기
    if (memberStatus === 1) {
      setDeactivateTarget(member);
      setDeactivateReason("");
      setDeactivateTerm(3);
      return;
    }

    // 비활성 회원이면 활성화 확인
    if (!window.confirm(`${member.memberId}번 회원을 활성화하시겠습니까?`)) {
      return;
    }

    startProcessing(memberId);
    try {
      await patchActivateMember(memberId);

      setMembers((prevMembers) =>
        prevMembers.map((item) =>
          item.memberId === memberId ? { ...item, memberStatus: 1 } : item,
        ),
      );
    } catch (err) {
      console.error("회원 활성화 실패:", err);

      alert(err.response?.data?.message ?? "회원 활성화에 실패했습니다.");
    } finally {
      finishProcessing(memberId);
    }
  };

  // 비활성화 확인
  const handleDeactivateConfirm = async () => {
    if (!deactivateTarget) return;

    const memberId = deactivateTarget.memberId;
    const body = deactivateReason.trim();

    if (!body) {
      alert("제재 사유를 입력해 주세요.");
      return;
    }

    if (processingIds.includes(memberId)) return;

    startProcessing(memberId);

    try {
      await patchDeactivateMember(memberId, {
        body,
        term: deactivateTerm,
      });

      // API 성공 후 화면 상태 변경
      setMembers((prevMembers) =>
        prevMembers.map((item) =>
          item.memberId === memberId ? { ...item, memberStatus: 0 } : item,
        ),
      );

      setDeactivateTarget(null);
      setDeactivateReason("");
      setDeactivateTerm(1);
    } catch (err) {
      console.error("회원 비활성화 실패:", err);

      alert(err.response?.data?.message ?? "회원 비활성화에 실패했습니다.");
    } finally {
      finishProcessing(memberId);
    }
  };

  // 회원 테이블의 데이터 행
  const renderMemberRow = (member) => {
    const isActive = member.memberStatus === 1;
    const isProcessing = processingIds.includes(member.memberId);

    return (
      <tr
        key={member.memberId}
        className="h-[60px] transition-colors hover:bg-gray-50"
      >
        <td className="px-3 text-gray-500">{member.memberId}</td>

        <td className="px-3 font-medium text-gray-800">
          {maskName(member.name)}
        </td>

        <td className="truncate px-3 text-gray-700">
          {member.nickname || "-"}
        </td>

        <td className="truncate px-3 text-gray-600">{member.email || "-"}</td>

        <td className="whitespace-nowrap px-3 text-gray-600">
          {maskPhone(member.phone)}
        </td>

        <td className="whitespace-nowrap px-3 text-gray-500">
          {formatDate(member.joinCreatedAt)}
        </td>

        <td className="px-3">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${getMemberTypeClass(
              member.memberType,
            )}`}
          >
            {MEMBER_TYPE_LABEL[member.memberType] ?? member.memberType ?? "-"}
          </span>
        </td>

        <td className="px-3">
          {member.memberType !== "ADMIN" && (
            <button
              type="button"
              onClick={() => handleToggleStatus(member)}
              disabled={isProcessing}
              className={`w-[88px] px-3 py-2 text-xs font-semibold transition
        disabled:cursor-wait disabled:opacity-50 ${
          isProcessing
            ? "bg-gray-400 text-white"
            : isActive
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-red-600 text-white hover:bg-red-700"
        }`}
            >
              {isProcessing ? "처리 중..." : isActive ? "활성화" : "비활성화"}
            </button>
          )}
        </td>
      </tr>
    );
  };

  // 테이블 행 렌더링
  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={8} className="h-[300px] text-gray-400">
            회원 목록을 불러오는 중입니다.
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan={8} className="h-[300px] text-red-500">
            {error}
          </td>
        </tr>
      );
    }

    if (members.length === 0) {
      return (
        <tr>
          <td colSpan={8} className="h-[300px] text-gray-400">
            등록된 회원이 없습니다.
          </td>
        </tr>
      );
    }

    return (
      <>
        {members.map(renderMemberRow)}

        {/* 페이지마다 최대 5행의 높이를 유지 */}
        {Array.from({
          length: Math.max(0, PAGE_SIZE - members.length),
        }).map((_, index) => (
          <tr key={`empty-${index}`} className="h-[60px]">
            {Array.from({ length: 8 }).map((_, cellIndex) => (
              <td key={cellIndex}>&nbsp;</td>
            ))}
          </tr>
        ))}
      </>
    );
  };

  return (
    <div className="w-full min-w-0 py-8">
      <div className="mx-auto w-[1400px] max-w-full px-4">
        <div className="mb-6">
          <h2 className="head-text text-4xl font-bold text-gray-900">
            회원 관리
          </h2>
        </div>

        <section className="overflow-hidden border border-gray-200 bg-white">
          {/* 목록 상단 */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50/70 px-5 py-4">
            <span className="text-sm font-semibold text-gray-700">
              회원 목록
            </span>

            <span className="text-sm text-gray-500">
              {pageData.totalCount != null
                ? `총 ${pageData.totalCount}명`
                : "회원 목록"}
            </span>
          </div>

          {/* 조회 오류 안내 */}
          {!loading && error && (
            <div className="py-4 text-center text-sm text-red-500">
              {error}

              <button
                type="button"
                onClick={fetchMembers}
                className="ml-3 font-semibold underline"
              >
                다시 시도
              </button>
            </div>
          )}

          {/* 회원 테이블 */}
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[950px] table-fixed border-collapse text-center text-sm">
              <colgroup>
                <col className="w-[90px]" />
                <col className="w-[100px]" />
                <col className="w-[150px]" />
                <col className="w-[180px]" />
                <col className="w-[150px]" />
                <col className="w-[180px]" />
                <col className="w-[150px]" />
                <col className="w-[120px]" />
              </colgroup>

              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  {[
                    "회원 번호",
                    "이름",
                    "닉네임",
                    "이메일",
                    "전화번호",
                    "가입일",
                    "회원 유형",
                    "계정 상태",
                  ].map((label) => (
                    <th
                      key={label}
                      className="h-12 border-b border-gray-200 px-3 font-semibold"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {renderTableBody()}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          <div className="flex min-h-[64px] items-center justify-center gap-1.5 border-t border-gray-200 bg-white px-5 py-3">
            <button
              type="button"
              onClick={() => changePage(page - 1)}
              disabled={page === 1 || loading}
              className="h-8 rounded-md border border-gray-200 px-3 text-xs font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
            >
              이전
            </button>

            {pageNumberList.map((pageNumber) => (
              <button
                type="button"
                key={pageNumber}
                onClick={() => changePage(pageNumber)}
                disabled={loading}
                className={`h-8 min-w-8 rounded-md px-2.5 text-xs font-semibold transition ${
                  pageNumber === page
                    ? "bg-gray-900 text-white"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              onClick={() => changePage(page + 1)}
              disabled={page >= totalPages || loading}
              className="h-8 rounded-md border border-gray-200 px-3 text-xs font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
            >
              다음
            </button>
          </div>
        </section>
      </div>

      {/* 회원 비활성화 모달 */}
      {deactivateTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={closeDeactivateModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="deactivate-modal-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h3
              id="deactivate-modal-title"
              className="text-xl font-bold text-gray-900"
            >
              회원 비활성화
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {deactivateTarget.memberId}번 회원의 계정을 비활성화합니다.
            </p>

            {/* 비활성화 사유 */}
            <div className="mt-6">
              <label
                htmlFor="deactivate-reason"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                제재 사유
              </label>

              <textarea
                id="deactivate-reason"
                value={deactivateReason}
                onChange={(event) => setDeactivateReason(event.target.value)}
                placeholder="제재 사유를 입력해 주세요."
                rows={3}
                disabled={processingIds.includes(deactivateTarget.memberId)}
                className="w-full resize-none rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-gray-500 disabled:bg-gray-100"
              />
            </div>

            {/* 비활성화 기간 */}
            <div className="mt-5">
              <label
                htmlFor="deactivate-term"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                비활성화 기간
              </label>

              <select
                id="deactivate-term"
                value={deactivateTerm}
                onChange={(event) =>
                  setDeactivateTerm(Number(event.target.value))
                }
                disabled={processingIds.includes(deactivateTarget.memberId)}
                className="mb-5 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm outline-none focus:border-gray-500 disabled:bg-gray-100"
              >
                {DEACTIVATE_TERMS.map((term) => (
                  <option key={term.value} value={term.value}>
                    {term.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 모달 버튼 */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={processingIds.includes(deactivateTarget.memberId)}
                onClick={closeDeactivateModal}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                취소
              </button>

              <button
                type="button"
                disabled={processingIds.includes(deactivateTarget.memberId)}
                onClick={handleDeactivateConfirm}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-wait disabled:opacity-50"
              >
                {processingIds.includes(deactivateTarget.memberId)
                  ? "처리 중..."
                  : "비활성화 확인"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageMemberComponent;
