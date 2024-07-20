const Answer = () => {
  return (
    <div className="w-[900px]">
      <div className="w-[900px] px-6 py-5  bg-white p-6 mt-4 rounded-2xl">
        <h2 className="text-2xl font-bold inline-block">Hỏi Đáp</h2>
        <div className="mt-4">
          <input
            className="border-solid border-gray-300 w-full px-3  block leading-8 rounded-full "
            type="text"
            placeholder="Chia sẻ, đánh giá về  sản phẩm  hoặc gửi câu hỏi cho Belly&Babe"
          />
        </div>
        <div className="mt-8 border-b border-black">
          {/* Each rating content */}
          <div className="flex ">
            <div className="img-comment w-16 h-16 relative rounded-full">
              <div className=" bg-name w-16 h-16 float-left h-16 rounded-full bg-[#ffe3ec] text-[#919191] bg-cover bg-no-repeat text-center uppercase text-3xl border-solid leading-[56px]">
                N
              </div>
            </div>
            <div className="ml-5">
              <span className="font-bold">Quy Ngoc</span>
              <div className="comment-text text-sm w-[704px] rounded-xl bg-[#FDEBF2] min-h-9 mt-[6px] py-2 px-[10px]"></div>
              <div className="rely flex mt-15">
                <div className="rely rounded-xl w-[704px] text-sm min-h-9 mt-[6px] bg-[#F2F2F2] py-2 px-[10px]"></div>
                <div className="img-comment w-16 h-16 relative rounded-full ml-3">
                  <div className=" bg-name w-16 h-16 float-left h-16 rounded-full bg-[#ffe3ec] text-[#919191] bg-cover bg-no-repeat text-center uppercase text-3xl border-solid leading-[56px]">
                    N
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Answer;
