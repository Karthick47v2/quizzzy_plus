import { TbSend2 } from "react-icons/tb";
import ChatElement from "../components/ChatElement";

const ChatBot = () => {
  return (
    <>
      <div className="bg-white border-x max-w-5xl mx-auto h-full overflow-y-scroll">
        <div className="px-10 pt-[20%] sm:pt-[15%] md:pt-[8%]">
          <ChatElement
            side="end"
            message="It was said that you would, destroy the Sith, not join them."
          />
          <ChatElement
            side="start"
            message="It was said that you would, destroy the Sith, not join them."
          />
          <ChatElement
            side="end"
            message="It was said that you would, destroy the Sith, not join them."
          />

          <div className="h-[100px]"></div>
        </div>
      </div>
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex w-[80%] md:w-[50%] lg:w-[30%] items-center justify-center">
        <input
          type="text"
          placeholder="Message Quizzy..."
          className="input rounded-none rounded-l-md input-bordered input-primary w-full"
        />
        <button className="btn btn-primary rounded-none rounded-r-md">
          <TbSend2 size={20} />
        </button>
      </div>
    </>
  );
};
export default ChatBot;
