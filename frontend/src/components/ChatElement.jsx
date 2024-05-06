const ChatElement = ({ side, message }) => {
  return (
    <div
      className={`chat chat-start mt-4 ${
        side === "start" ? "chat-start" : "chat-end"
      }`}
    >
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS chat bubble component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
          />
        </div>
      </div>
      <div className="chat-bubble">{message}</div>
    </div>
  );
};
export default ChatElement;
