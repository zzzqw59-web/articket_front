import { useState } from "react";
import { patchCreateStaff } from "../../api/staffApi";

const INITIAL_FORM = {
  email: "",
  password: "",
  nickname: "",
  name: "",
  phone: "",
};

const FORM_FIELDS = [
  {
    id: "email",
    label: "이메일",
    type: "email",
    autoComplete: "email",
    placeholder: "example@articket.com",
  },
  {
    id: "password",
    label: "비밀번호",
    type: "password",
    autoComplete: "new-password",
    placeholder: "비밀번호를 입력해 주세요.",
  },
  {
    id: "nickname",
    label: "닉네임",
    type: "text",
    autoComplete: "nickname",
    placeholder: "사용할 닉네임을 입력해 주세요.",
  },
  {
    id: "name",
    label: "이름",
    type: "text",
    autoComplete: "name",
    placeholder: "이름을 입력해 주세요.",
  },
  {
    id: "phone",
    label: "연락처",
    type: "tel",
    autoComplete: "tel",
    placeholder: "010-1234-5678",
  },
];

const INPUT_CLASS =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900";

const AdminCreateAccountComponent = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await patchCreateStaff(form);

      alert("관계자 계정이 생성되었습니다.");
      setForm({ ...INITIAL_FORM });
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "계정 생성에 실패했습니다. 입력 정보와 권한을 확인해 주세요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl px-5 py-8">
      <div className="mb-6">
        <h2 className="head-text text-4xl font-bold">관계자 계정 생성</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 border border-gray-200 bg-white p-8"
      >
        {FORM_FIELDS.map(({ id, label, type, autoComplete, placeholder }) => (
          <div key={id} className="space-y-2">
            <label
              htmlFor={id}
              className="block text-sm font-semibold text-gray-700"
            >
              {label}
            </label>

            <input
              id={id}
              name={id}
              type={type}
              autoComplete={autoComplete}
              value={form[id]}
              onChange={handleChange}
              placeholder={placeholder}
              required
              className={INPUT_CLASS}
            />
          </div>
        ))}

        <div className="border-t border-gray-100 pt-5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-gray-900 px-3 py-2.5 font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "계정 생성 중..." : "관계자 계정 생성"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCreateAccountComponent;
