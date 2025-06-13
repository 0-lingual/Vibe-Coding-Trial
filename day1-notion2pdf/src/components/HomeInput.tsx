import React from "react";

const HomeInput = () => {
  return (
    <form className="flex flex-col items-center gap-4 w-full max-w-xl mx-auto mt-10">
      <input
        type="url"
        placeholder="공개 Notion 페이지 URL을 입력하세요"
        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        PDF로 변환하기
      </button>
    </form>
  );
};

export default HomeInput;
