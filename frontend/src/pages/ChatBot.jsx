import { useState } from 'react';

import { TbSend2 } from 'react-icons/tb';
import { FaFileCirclePlus } from 'react-icons/fa6';

import ChatElement from '../components/ChatElement';

const ChatBot = () => {
  const [chats, setChats] = useState([
    {
      role: 'bot',
      message: 'Hello! How can I help you today',
    },
    {
      role: 'user',
      message: 'I want to get a summary of the uploaded pdf',
    },
    {
      role: 'bot',
      message:
        ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut, molestias fuga? Eveniet similique quis quasi, fugit facilis, neque quo nam distinctio non qui itaque! Amet atque obcaecati sunt quasi veritatis.',
    },
  ]);
  const [userInputText, setUserInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTextSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (userInputText) {
      setChats((prevChats) => [
        ...prevChats,
        { role: 'user', message: userInputText },
      ]);
      setUserInputText('');
    } else {
      setLoading(false);
      return;
    }
    setLoading(false);
  };

  return (
    <>
      <div className="bg-white border-x max-w-5xl mx-auto h-full overflow-y-scroll">
        <div className="px-10 pt-[20%] sm:pt-[15%] md:pt-[8%]">
          {chats?.map((chat, index, chats) => {
            if (chat.role == 'bot' && index === chats.length - 1) {
              return (
                <ChatElement
                  key={index}
                  isBot={true}
                  side="start"
                  message={chat.message}
                  animate={true}
                  delay={8}
                />
              );
            } else if (chat.role == 'bot') {
              return (
                <ChatElement
                  key={index}
                  isBot={true}
                  side="start"
                  message={chat.message}
                />
              );
            } else {
              return (
                <ChatElement
                  key={index}
                  isBot={false}
                  side="end"
                  message={chat.message}
                />
              );
            }
          })}

          <div className="h-[100px]"></div>
        </div>
      </div>
      <form onSubmit={handleTextSubmit}>
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex w-[80%] md:w-[50%] lg:w-[30%] items-center justify-center">
          <input
            type="text"
            placeholder="Message Quizzy..."
            className="input rounded-none rounded-l-md input-bordered input-primary w-full"
            value={userInputText}
            onChange={(e) => setUserInputText(e.target.value)}
          />

          <button
            className="btn btn-primary rounded-none rounded-r-md"
            disabled={loading}
          >
            <TbSend2 size={20} />
          </button>
        </div>
      </form>
    </>
  );
};
export default ChatBot;
