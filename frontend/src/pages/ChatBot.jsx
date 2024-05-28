import { useEffect, useRef, useState } from 'react';
import { uploadBytes, ref } from 'firebase/storage';

import { TbSend2 } from 'react-icons/tb';
import { FaFileCirclePlus } from 'react-icons/fa6';

import ChatElement from '../components/ChatElement';
import { storage } from '../utils/firebaseConfig';
import { useLocation } from 'react-router-dom';

const ChatBot = () => {
  const location = useLocation();
  const { state } = location;
  const { token } = state || {};

  const [chats, setChats] = useState([]);
  const [userInputText, setUserInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [firstRender, setFirstRender] = useState(true);
  const [file, setFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const closeButtonRef = useRef(null);
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    document.getElementById('file_upload_model').showModal();
  }, []);

  useEffect(() => {
    if (fileUploaded) {
      document.getElementById('file_upload_model').close();
    }
  }, [fileUploaded]);

  const handleFileUpload = () => {
    if (file == null) return;
    
    const fileName = `chatpdf/${file.name}`;
    const storageRef = ref(storage, fileName);

    uploadBytes(storageRef, file)
      .then((snapshot) => {
        fetch('http://quizzzy.com/chatbot/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ filename: fileName}),
        })
        .then(response => {
          if (response.ok) {
            console.log('File name sent to backend successfully');
            setFileUploaded(true);
          } else {
            console.error('Failed to send file name to backend:', response.statusText);
          }
        })
        .catch(error => console.error('Error sending file name to backend:', error));
      })
      .catch((error) => console.log(error));
};

  const resetFile = () => {
    fileInputRef.current.value = null;
    setFile(null);
    setFileUploaded(false);
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();

    if (!userInputText.trim() || !fileUploaded) return;

    setLoading(true);

    try {
      const response = await fetch('http://quizzzy.com/chatbot/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: userInputText }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const responseData = await response.text();

      setChats([
        ...chats,
        { role: 'user', message: userInputText },
        { role: 'bot', message: responseData.trim().replace(/^"+|"+$/g, '') },
      ]);
      setUserInputText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }

    setLoading(false);
  };
  

  return (
    <>
      <div className="bg-white border-x max-w-5xl mx-auto h-full overflow-y-scroll">
        <div ref={bottomRef} className="px-10 pt-[20%] sm:pt-[15%] md:pt-[8%]">
          {chats?.map((chat, index, chats) => {
            if (chat.role == 'bot' && index === chats.length - 1) {
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
              return (
                <ChatElement key={index} isBot={true} message={chat.message} />
              );
            } else if (chat.role == 'user') {
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
              disabled={!fileUploaded}
            />

            <button
              className="btn btn-primary rounded-none text-white "
              disabled={loading || !userInputText || !fileUploaded}
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
      <dialog id="file_upload_model" className="modal" onClose={() => false}>
  <div className="modal-box">
    {/* Conditional rendering of the close button */}
    <form method="dialog">
      <button
        ref={closeButtonRef}
        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        disabled={!fileUploaded} // Disable close button if file is not uploaded
      >
        ✕
      </button>
    </form>
    <h3 className="font-bold text-lg">Upload a file (.docx, .txt, .pdf)</h3>
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
