const PDFtoQuestions = () => {
  return (
    <>
      <div className="bg-white border-x max-w-5xl mx-auto h-full flex justify-center items-center overflow-y-scroll">
        <div className="join">
          <input
            type="file"
            className="file-input file-input-bordered w-full max-w-xs join-item"
            accept=".pdf"
          />
          <div className="indicator">
            <button className="btn btn-primary text-white fon join-item">
              Generate
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default PDFtoQuestions;
