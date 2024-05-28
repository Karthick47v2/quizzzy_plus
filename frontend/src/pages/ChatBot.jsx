import { useEffect, useRef, useState } from 'react';
import { uploadBytes, ref } from 'firebase/storage';

import { TbSend2 } from 'react-icons/tb';
import { FaFileCirclePlus } from 'react-icons/fa6';

import ChatElement from '../components/ChatElement';
import { storage } from '../utils/firebaseConfig';

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
  const [anmitionComplete, setAnimationComplete] = useState(false);
  const [firstRender, setFirstRender] = useState(true);
  const [file, setFile] = useState(null);
  const closeButtonRef = useRef(null);
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
    if (firstRender) {
      setFirstRender(false);
    }
  }, [chats, firstRender]);

  const handleFileUpload = () => {
    if (file == null) return;
    const storageRef = ref(storage, `quizzyfiles/${file.name}`);

    uploadBytes(storageRef, file)
      .then((snapshot) => {
        console.log('Uploaded a file!');
        console.log(snapshot);
      })
      .catch((error) => console.log(error));

    closeButtonRef.current.click();
  };

  const resetFile = () => {
    fileInputRef.current.value = null;
    setFile(null);
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (userInputText) {
      setChats((prevChats) => [
        ...prevChats,
        { role: 'user', message: userInputText },
        { role: 'bot', message: userInputText },
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
        <div ref={bottomRef} className="px-10 pt-[20%] sm:pt-[15%] md:pt-[8%]">
          {chats?.map((chat, index, chats) => {
            if (chat.role == 'bot' && index === chats.length - 1) {
              console.log('not firstRender render but last element bot');
              return (
                <ChatElement
                  key={index}
                  isBot={true}
                  message={chat.message}
                  animate={true}
                  setAnimationComplete={setAnimationComplete}
                  delay={8}
                />
              );
            } else if (chat.role == 'bot') {
              console.log('bot element');
              return (
                <ChatElement key={index} isBot={true} message={chat.message} />
              );
            } else if (chat.role == 'user') {
              console.log('user');

              return (
                <ChatElement key={index} isBot={false} message={chat.message} />
              );
            }
          })}

          <div className="h-[100px]"></div>
        </div>
      </div>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] md:w-[60%] lg:w-[50%] flex items-center justify-center">
        <form className="w-full" onSubmit={handleTextSubmit}>
          <div className="flex">
            <input
              type="text"
              placeholder="Message Quizzy..."
              className="input rounded-none rounded-l-md input-bordered input-primary w-full "
              value={userInputText}
              onChange={(e) => setUserInputText(e.target.value)}
            />

            <button
              className="btn btn-primary rounded-none text-white "
              disabled={loading || !userInputText}
            >
              <TbSend2 size={20} />
            </button>
          </div>
        </form>
        <button
          className="btn btn-neutral rounded-none rounded-r-md"
          disabled={loading}
          onClick={() =>
            document.getElementById('file_upload_model').showModal()
          }
        >
          <FaFileCirclePlus size={20} />
        </button>
      </div>

      {/* File upload modal */}
      <dialog id="file_upload_model" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button
              ref={closeButtonRef}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">
            {'Upload a file (.docx, .txt, .pdf)'}
          </h3>
          <div className="py-4 flex-col items-center justify-center">
            <div className="w-full flex items-center justify-center gap-6">
              <input
                type="file"
                className="file-input file-input-sm flex-1"
                accept=".pdf,.docx,.txt"
                onChange={(e) => setFile(e.target.files[0])}
                ref={fileInputRef}
              />
              <button
                className="btn btn-sm bg-red-400  text-white"
                disabled={file === null}
                onClick={resetFile}
              >
                clear
              </button>
            </div>
            <button
              className="btn btn-sm btn-primary w-full mt-3"
              disabled={file === null}
              onClick={handleFileUpload}
            >
              Upload
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};
export default ChatBot;
