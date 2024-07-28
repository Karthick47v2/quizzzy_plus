import { useEffect, useRef, useState } from 'react';
import { uploadBytes, ref } from 'firebase/storage';

import { TbSend2 } from 'react-icons/tb';
import { FaFileCirclePlus } from 'react-icons/fa6';
import { IoIosRemoveCircle } from 'react-icons/io';

import ChatElement from '../components/ChatElement';
import { storage } from '../utils/firebaseConfig';

const ChatBot = () => {
  const token = localStorage.getItem('userToken');

  const [chats, setChats] = useState([]);
  const [userInputText, setUserInputText] = useState('');
  const [loading, setLoading] = useState(false); //message loading
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false); //file uploading
  const [fileUploaded, setFileUploaded] = useState(false);
  const [resError, setResError] = useState('');
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

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [chats]);

  const handleFileUpload = () => {
    if (file == null) return;
    setUploading(true);
    const fileName = `chatpdf/${file.name}`;
    const storageRef = ref(storage, fileName);

    uploadBytes(storageRef, file)
      .then(async (snapshot) => {
        try {
          const response = await fetch('http://quizzzy.com/chatbot/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ filename: fileName }),
          });
          if (response.ok) {
            console.log('File details sent to backend successfully');
            setFileUploaded(true);
            setUploading(false);
          } else {
            console.error(
              'Failed to send file details to backend:',
              response.statusText
            );
            setUploading(false);
          }
        } catch (error) {
          console.error('Error sending file details to backend:', error);
          setUploading(false);
        }
      })
      .catch((error) => {
        console.error('Error uploading file to firebase store', error);
        setUploading(false);
      });
  };

  const resetFile = () => {
    fileInputRef.current.value = null;
    setFile(null);
    setFileUploaded(false);
    setChats([]);
  };

  const resetChat = () => {
    setChats([]);
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();

    if (!userInputText.trim() || !fileUploaded) return;

    setUserInputText('');
    setLoading(true);
    setChats((prevChats) => [
      ...prevChats,
      { role: 'user', message: userInputText },
    ]);

    try {
      const response = await fetch('http://quizzzy.com/chatbot/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userInputText }),
      });

      if (!response.ok) {
        console.error('Error sending message:', error);
        setLoading(false);
        return;
      }

      const responseData = await response.text();

      setChats((prevChats) => [
        ...prevChats,
        { role: 'bot', message: responseData.trim().replace(/^"+|"+$/g, '') },
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setLoading(false);
    }
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
                  delay={6}
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

          {loading && (
            <div className="mt-2 py-3">
              <div className="flex justify-center items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 350 350"
                  xmlSpace="preserve"
                  className="size-5 animate-ping"
                >
                  <path
                    fill="#041C3F"
                    d="M273.646 177.521v-2.935c0-23.173-18.853-42.025-42.024-42.025H181.77v-17.956c11.31-2.999 19.671-13.319 19.671-25.559 0-14.581-11.861-26.441-26.441-26.441s-26.442 11.86-26.442 26.441c0 12.239 8.361 22.56 19.67 25.559v17.956h-49.85c-23.173 0-42.025 18.853-42.025 42.025v2.935c-16.411 3.172-28.845 17.645-28.845 34.967 0 17.344 12.46 31.826 28.897 34.979 1.096 22.201 19.503 39.928 41.973 39.928H231.62c22.469 0 40.876-17.727 41.973-39.928 16.437-3.152 28.898-17.635 28.898-34.979 0-17.322-12.433-31.795-28.845-34.967zM76.354 233.496c-8.869-2.865-15.302-11.197-15.302-21.008 0-9.809 6.434-18.141 15.302-21.006v42.014zm183.75 11.873c0 15.705-12.778 28.482-28.483 28.482H118.379c-15.706 0-28.483-12.777-28.483-28.482v-70.782c0-15.705 12.777-28.482 28.483-28.482h113.242c15.705 0 28.483 12.777 28.483 28.482v70.782zm13.542-11.873v-42.014c8.868 2.865 15.303 11.197 15.303 21.006-.001 9.811-6.435 18.143-15.303 21.008z"
                  />
                  <path
                    fill="#9788E2"
                    d="M76.354 233.496c-8.869-2.865-15.302-11.197-15.302-21.008 0-9.809 6.434-18.141 15.302-21.006v42.014zM162.1 89.047c0-7.112 5.787-12.899 12.9-12.899 7.112 0 12.899 5.787 12.899 12.899 0 7.112-5.787 12.899-12.899 12.899-7.113 0-12.9-5.787-12.9-12.899z"
                  />
                  <path
                    fill="#8478D6"
                    d="M175 76.147c-5.371 0-9.982 3.302-11.92 7.979a12.838 12.838 0 0 1 4.92-.979c7.112 0 12.899 5.787 12.899 12.899 0 1.742-.352 3.402-.98 4.92 4.678-1.938 7.98-6.55 7.98-11.92 0-7.111-5.787-12.899-12.899-12.899z"
                  />
                  <path
                    fill="#88E5D9"
                    d="M260.104 245.369c0 15.705-12.778 28.482-28.483 28.482H118.379c-15.706 0-28.483-12.777-28.483-28.482v-70.782c0-15.705 12.777-28.482 28.483-28.482h113.242c15.705 0 28.483 12.777 28.483 28.482v70.782z"
                  />
                  <path
                    fill="#69CCBE"
                    d="M231.621 146.105h-25.224c15.706 0 28.483 12.777 28.483 28.482v70.782c0 15.705-12.777 28.482-28.483 28.482h25.224c15.705 0 28.483-12.777 28.483-28.482v-70.782c0-15.705-12.778-28.482-28.483-28.482z"
                  />
                  <path
                    fill="#9788E2"
                    d="M273.646 233.496v-42.014c8.868 2.865 15.303 11.197 15.303 21.006-.001 9.811-6.435 18.143-15.303 21.008z"
                  />
                  <path
                    fill="#8478D6"
                    d="M68.702 212.488c0-6.66 2.971-12.633 7.651-16.683v-4.323c-8.869 2.865-15.302 11.197-15.302 21.006 0 9.811 6.434 18.143 15.302 21.008v-4.323c-4.68-4.05-7.651-10.024-7.651-16.685zM273.646 191.482v4.324c4.68 4.049 7.651 10.023 7.651 16.682 0 6.661-2.971 12.635-7.651 16.684v4.324c8.868-2.865 15.303-11.197 15.303-21.008-.001-9.808-6.435-18.14-15.303-21.006z"
                  />
                  <path
                    fill="#FF54A4"
                    d="M224.384 201.625a6.44 6.44 0 0 1-6.433-6.432 6.441 6.441 0 0 1 6.433-6.434 6.441 6.441 0 0 1 6.433 6.434 6.44 6.44 0 0 1-6.433 6.432zM125.616 201.625a6.44 6.44 0 0 1-6.433-6.432 6.44 6.44 0 0 1 6.433-6.434 6.441 6.441 0 0 1 6.433 6.434 6.44 6.44 0 0 1-6.433 6.432z"
                  />
                  <path
                    fill="#EF4198"
                    d="M224.384 188.76c-2.852 0-5.273 1.868-6.114 4.443a6.413 6.413 0 0 1 1.989-.318 6.441 6.441 0 0 1 6.433 6.434c0 .694-.114 1.361-.318 1.988 2.576-.84 4.443-3.261 4.443-6.113a6.441 6.441 0 0 0-6.433-6.434zM125.616 188.76c-2.853 0-5.273 1.868-6.114 4.443a6.383 6.383 0 0 1 1.989-.318 6.441 6.441 0 0 1 6.433 6.434c0 .694-.114 1.361-.318 1.988 2.576-.84 4.443-3.261 4.443-6.113a6.44 6.44 0 0 0-6.433-6.434z"
                  />
                  <path
                    fill="#041C3F"
                    d="M224.384 175.219c-11.015 0-19.975 8.961-19.975 19.975 0 11.014 8.96 19.975 19.975 19.975 11.014 0 19.975-8.961 19.975-19.975-.001-11.014-8.962-19.975-19.975-19.975zm0 26.406a6.44 6.44 0 0 1-6.433-6.432 6.441 6.441 0 0 1 6.433-6.434 6.441 6.441 0 0 1 6.433 6.434 6.44 6.44 0 0 1-6.433 6.432zM125.616 175.219c-11.015 0-19.975 8.961-19.975 19.975 0 11.014 8.961 19.975 19.975 19.975 11.014 0 19.975-8.961 19.975-19.975 0-11.014-8.961-19.975-19.975-19.975zm0 26.406a6.44 6.44 0 0 1-6.433-6.432 6.44 6.44 0 0 1 6.433-6.434 6.441 6.441 0 0 1 6.433 6.434 6.44 6.44 0 0 1-6.433 6.432z"
                  />
                  <path
                    fill="#69CCBE"
                    d="M193.451 241.157h-36.902a6.77 6.77 0 1 0 0 13.541h36.902a6.77 6.77 0 0 0 0-13.541z"
                  />
                  <path
                    fill="#041C3F"
                    d="M193.451 236.219h-36.902a6.77 6.77 0 1 0 0 13.541h36.902a6.77 6.77 0 0 0 0-13.541z"
                  />
                </svg>
                <span className="font-semibold">Thinking</span>
                <span className="loading loading-bars loading-sm"></span>
              </div>
            </div>
          )}

          {!fileUploaded && (
            <div className="mt-2 py-3 bg-green-200 rounded-md">
              <div className="flex justify-center items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 350 350"
                  xmlSpace="preserve"
                  className="size-8"
                >
                  <path
                    fill="#041C3F"
                    d="M273.646 177.521v-2.935c0-23.173-18.853-42.025-42.024-42.025H181.77v-17.956c11.31-2.999 19.671-13.319 19.671-25.559 0-14.581-11.861-26.441-26.441-26.441s-26.442 11.86-26.442 26.441c0 12.239 8.361 22.56 19.67 25.559v17.956h-49.85c-23.173 0-42.025 18.853-42.025 42.025v2.935c-16.411 3.172-28.845 17.645-28.845 34.967 0 17.344 12.46 31.826 28.897 34.979 1.096 22.201 19.503 39.928 41.973 39.928H231.62c22.469 0 40.876-17.727 41.973-39.928 16.437-3.152 28.898-17.635 28.898-34.979 0-17.322-12.433-31.795-28.845-34.967zM76.354 233.496c-8.869-2.865-15.302-11.197-15.302-21.008 0-9.809 6.434-18.141 15.302-21.006v42.014zm183.75 11.873c0 15.705-12.778 28.482-28.483 28.482H118.379c-15.706 0-28.483-12.777-28.483-28.482v-70.782c0-15.705 12.777-28.482 28.483-28.482h113.242c15.705 0 28.483 12.777 28.483 28.482v70.782zm13.542-11.873v-42.014c8.868 2.865 15.303 11.197 15.303 21.006-.001 9.811-6.435 18.143-15.303 21.008z"
                  />
                  <path
                    fill="#9788E2"
                    d="M76.354 233.496c-8.869-2.865-15.302-11.197-15.302-21.008 0-9.809 6.434-18.141 15.302-21.006v42.014zM162.1 89.047c0-7.112 5.787-12.899 12.9-12.899 7.112 0 12.899 5.787 12.899 12.899 0 7.112-5.787 12.899-12.899 12.899-7.113 0-12.9-5.787-12.9-12.899z"
                  />
                  <path
                    fill="#8478D6"
                    d="M175 76.147c-5.371 0-9.982 3.302-11.92 7.979a12.838 12.838 0 0 1 4.92-.979c7.112 0 12.899 5.787 12.899 12.899 0 1.742-.352 3.402-.98 4.92 4.678-1.938 7.98-6.55 7.98-11.92 0-7.111-5.787-12.899-12.899-12.899z"
                  />
                  <path
                    fill="#88E5D9"
                    d="M260.104 245.369c0 15.705-12.778 28.482-28.483 28.482H118.379c-15.706 0-28.483-12.777-28.483-28.482v-70.782c0-15.705 12.777-28.482 28.483-28.482h113.242c15.705 0 28.483 12.777 28.483 28.482v70.782z"
                  />
                  <path
                    fill="#69CCBE"
                    d="M231.621 146.105h-25.224c15.706 0 28.483 12.777 28.483 28.482v70.782c0 15.705-12.777 28.482-28.483 28.482h25.224c15.705 0 28.483-12.777 28.483-28.482v-70.782c0-15.705-12.778-28.482-28.483-28.482z"
                  />
                  <path
                    fill="#9788E2"
                    d="M273.646 233.496v-42.014c8.868 2.865 15.303 11.197 15.303 21.006-.001 9.811-6.435 18.143-15.303 21.008z"
                  />
                  <path
                    fill="#8478D6"
                    d="M68.702 212.488c0-6.66 2.971-12.633 7.651-16.683v-4.323c-8.869 2.865-15.302 11.197-15.302 21.006 0 9.811 6.434 18.143 15.302 21.008v-4.323c-4.68-4.05-7.651-10.024-7.651-16.685zM273.646 191.482v4.324c4.68 4.049 7.651 10.023 7.651 16.682 0 6.661-2.971 12.635-7.651 16.684v4.324c8.868-2.865 15.303-11.197 15.303-21.008-.001-9.808-6.435-18.14-15.303-21.006z"
                  />
                  <path
                    fill="#FF54A4"
                    d="M224.384 201.625a6.44 6.44 0 0 1-6.433-6.432 6.441 6.441 0 0 1 6.433-6.434 6.441 6.441 0 0 1 6.433 6.434 6.44 6.44 0 0 1-6.433 6.432zM125.616 201.625a6.44 6.44 0 0 1-6.433-6.432 6.44 6.44 0 0 1 6.433-6.434 6.441 6.441 0 0 1 6.433 6.434 6.44 6.44 0 0 1-6.433 6.432z"
                  />
                  <path
                    fill="#EF4198"
                    d="M224.384 188.76c-2.852 0-5.273 1.868-6.114 4.443a6.413 6.413 0 0 1 1.989-.318 6.441 6.441 0 0 1 6.433 6.434c0 .694-.114 1.361-.318 1.988 2.576-.84 4.443-3.261 4.443-6.113a6.441 6.441 0 0 0-6.433-6.434zM125.616 188.76c-2.853 0-5.273 1.868-6.114 4.443a6.383 6.383 0 0 1 1.989-.318 6.441 6.441 0 0 1 6.433 6.434c0 .694-.114 1.361-.318 1.988 2.576-.84 4.443-3.261 4.443-6.113a6.44 6.44 0 0 0-6.433-6.434z"
                  />
                  <path
                    fill="#041C3F"
                    d="M224.384 175.219c-11.015 0-19.975 8.961-19.975 19.975 0 11.014 8.96 19.975 19.975 19.975 11.014 0 19.975-8.961 19.975-19.975-.001-11.014-8.962-19.975-19.975-19.975zm0 26.406a6.44 6.44 0 0 1-6.433-6.432 6.441 6.441 0 0 1 6.433-6.434 6.441 6.441 0 0 1 6.433 6.434 6.44 6.44 0 0 1-6.433 6.432zM125.616 175.219c-11.015 0-19.975 8.961-19.975 19.975 0 11.014 8.961 19.975 19.975 19.975 11.014 0 19.975-8.961 19.975-19.975 0-11.014-8.961-19.975-19.975-19.975zm0 26.406a6.44 6.44 0 0 1-6.433-6.432 6.44 6.44 0 0 1 6.433-6.434 6.441 6.441 0 0 1 6.433 6.434 6.44 6.44 0 0 1-6.433 6.432z"
                  />
                  <path
                    fill="#69CCBE"
                    d="M193.451 241.157h-36.902a6.77 6.77 0 1 0 0 13.541h36.902a6.77 6.77 0 0 0 0-13.541z"
                  />
                  <path
                    fill="#041C3F"
                    d="M193.451 236.219h-36.902a6.77 6.77 0 1 0 0 13.541h36.902a6.77 6.77 0 0 0 0-13.541z"
                  />
                </svg>
                <span className="font-semibold">
                  Please upload a file to continue...
                </span>
              </div>
            </div>
          )}

          {fileUploaded && chats.length === 0 && (
            <div className="mt-2 py-3 bg-green-200 rounded-md">
              <div className="flex justify-center items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 350 350"
                  xmlSpace="preserve"
                  className="size-5 animate-ping mr-3"
                >
                  <path
                    fill="#041C3F"
                    d="M273.646 177.521v-2.935c0-23.173-18.853-42.025-42.024-42.025H181.77v-17.956c11.31-2.999 19.671-13.319 19.671-25.559 0-14.581-11.861-26.441-26.441-26.441s-26.442 11.86-26.442 26.441c0 12.239 8.361 22.56 19.67 25.559v17.956h-49.85c-23.173 0-42.025 18.853-42.025 42.025v2.935c-16.411 3.172-28.845 17.645-28.845 34.967 0 17.344 12.46 31.826 28.897 34.979 1.096 22.201 19.503 39.928 41.973 39.928H231.62c22.469 0 40.876-17.727 41.973-39.928 16.437-3.152 28.898-17.635 28.898-34.979 0-17.322-12.433-31.795-28.845-34.967zM76.354 233.496c-8.869-2.865-15.302-11.197-15.302-21.008 0-9.809 6.434-18.141 15.302-21.006v42.014zm183.75 11.873c0 15.705-12.778 28.482-28.483 28.482H118.379c-15.706 0-28.483-12.777-28.483-28.482v-70.782c0-15.705 12.777-28.482 28.483-28.482h113.242c15.705 0 28.483 12.777 28.483 28.482v70.782zm13.542-11.873v-42.014c8.868 2.865 15.303 11.197 15.303 21.006-.001 9.811-6.435 18.143-15.303 21.008z"
                  />
                  <path
                    fill="#9788E2"
                    d="M76.354 233.496c-8.869-2.865-15.302-11.197-15.302-21.008 0-9.809 6.434-18.141 15.302-21.006v42.014zM162.1 89.047c0-7.112 5.787-12.899 12.9-12.899 7.112 0 12.899 5.787 12.899 12.899 0 7.112-5.787 12.899-12.899 12.899-7.113 0-12.9-5.787-12.9-12.899z"
                  />
                  <path
                    fill="#8478D6"
                    d="M175 76.147c-5.371 0-9.982 3.302-11.92 7.979a12.838 12.838 0 0 1 4.92-.979c7.112 0 12.899 5.787 12.899 12.899 0 1.742-.352 3.402-.98 4.92 4.678-1.938 7.98-6.55 7.98-11.92 0-7.111-5.787-12.899-12.899-12.899z"
                  />
                  <path
                    fill="#88E5D9"
                    d="M260.104 245.369c0 15.705-12.778 28.482-28.483 28.482H118.379c-15.706 0-28.483-12.777-28.483-28.482v-70.782c0-15.705 12.777-28.482 28.483-28.482h113.242c15.705 0 28.483 12.777 28.483 28.482v70.782z"
                  />
                  <path
                    fill="#69CCBE"
                    d="M231.621 146.105h-25.224c15.706 0 28.483 12.777 28.483 28.482v70.782c0 15.705-12.777 28.482-28.483 28.482h25.224c15.705 0 28.483-12.777 28.483-28.482v-70.782c0-15.705-12.778-28.482-28.483-28.482z"
                  />
                  <path
                    fill="#9788E2"
                    d="M273.646 233.496v-42.014c8.868 2.865 15.303 11.197 15.303 21.006-.001 9.811-6.435 18.143-15.303 21.008z"
                  />
                  <path
                    fill="#8478D6"
                    d="M68.702 212.488c0-6.66 2.971-12.633 7.651-16.683v-4.323c-8.869 2.865-15.302 11.197-15.302 21.006 0 9.811 6.434 18.143 15.302 21.008v-4.323c-4.68-4.05-7.651-10.024-7.651-16.685zM273.646 191.482v4.324c4.68 4.049 7.651 10.023 7.651 16.682 0 6.661-2.971 12.635-7.651 16.684v4.324c8.868-2.865 15.303-11.197 15.303-21.008-.001-9.808-6.435-18.14-15.303-21.006z"
                  />
                  <path
                    fill="#FF54A4"
                    d="M224.384 201.625a6.44 6.44 0 0 1-6.433-6.432 6.441 6.441 0 0 1 6.433-6.434 6.441 6.441 0 0 1 6.433 6.434 6.44 6.44 0 0 1-6.433 6.432zM125.616 201.625a6.44 6.44 0 0 1-6.433-6.432 6.44 6.44 0 0 1 6.433-6.434 6.441 6.441 0 0 1 6.433 6.434 6.44 6.44 0 0 1-6.433 6.432z"
                  />
                  <path
                    fill="#EF4198"
                    d="M224.384 188.76c-2.852 0-5.273 1.868-6.114 4.443a6.413 6.413 0 0 1 1.989-.318 6.441 6.441 0 0 1 6.433 6.434c0 .694-.114 1.361-.318 1.988 2.576-.84 4.443-3.261 4.443-6.113a6.441 6.441 0 0 0-6.433-6.434zM125.616 188.76c-2.853 0-5.273 1.868-6.114 4.443a6.383 6.383 0 0 1 1.989-.318 6.441 6.441 0 0 1 6.433 6.434c0 .694-.114 1.361-.318 1.988 2.576-.84 4.443-3.261 4.443-6.113a6.44 6.44 0 0 0-6.433-6.434z"
                  />
                  <path
                    fill="#041C3F"
                    d="M224.384 175.219c-11.015 0-19.975 8.961-19.975 19.975 0 11.014 8.96 19.975 19.975 19.975 11.014 0 19.975-8.961 19.975-19.975-.001-11.014-8.962-19.975-19.975-19.975zm0 26.406a6.44 6.44 0 0 1-6.433-6.432 6.441 6.441 0 0 1 6.433-6.434 6.441 6.441 0 0 1 6.433 6.434 6.44 6.44 0 0 1-6.433 6.432zM125.616 175.219c-11.015 0-19.975 8.961-19.975 19.975 0 11.014 8.961 19.975 19.975 19.975 11.014 0 19.975-8.961 19.975-19.975 0-11.014-8.961-19.975-19.975-19.975zm0 26.406a6.44 6.44 0 0 1-6.433-6.432 6.44 6.44 0 0 1 6.433-6.434 6.441 6.441 0 0 1 6.433 6.434 6.44 6.44 0 0 1-6.433 6.432z"
                  />
                  <path
                    fill="#69CCBE"
                    d="M193.451 241.157h-36.902a6.77 6.77 0 1 0 0 13.541h36.902a6.77 6.77 0 0 0 0-13.541z"
                  />
                  <path
                    fill="#041C3F"
                    d="M193.451 236.219h-36.902a6.77 6.77 0 1 0 0 13.541h36.902a6.77 6.77 0 0 0 0-13.541z"
                  />
                </svg>
                <span className="font-semibold">
                  Awesome! Now ask whatever you want...
                </span>
              </div>
            </div>
          )}

          <div className="h-[100px]"></div>
        </div>
      </div>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] md:w-[60%] lg:w-[50%] flex items-center justify-center">
        <button
          className="btn btn-warning rounded-l-md rounded-none"
          onClick={resetChat}
        >
          Clear Chat
        </button>
        <form className="w-full" onSubmit={handleTextSubmit}>
          <div className="flex">
            <input
              type="text"
              placeholder="Message Quizzy..."
              className="input rounded-none input-bordered input-primary w-full "
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
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              disabled={uploading}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg text-center">
            Upload a file you want to ask questions from
          </h3>
          <p className="font-thin text-center">
            supported formats <span className="">.docx , .txt , .pdf</span>
          </p>
          <div className="pt-6 pb-1 flex-col items-center justify-center">
            <div className="w-full flex items-center justify-center gap-6">
              <input
                type="file"
                className="file-input file-input-sm flex-1"
                accept=".pdf,.docx,.txt"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  setChats([]);
                  setFileUploaded(false);
                }}
                ref={fileInputRef}
              />
              <div
                className="tooltip hover:tooltip-open tooltip-bottom"
                data-tip="remove"
              >
                <button
                  className="btn btn-sm btn-square bg-red-500 text-white"
                  onClick={resetFile}
                  disabled={file === null || uploading}
                >
                  <IoIosRemoveCircle size={15} />
                </button>
              </div>
            </div>
            {!uploading && (
              <button
                className="btn btn-sm btn-primary w-full mt-3 text-white"
                disabled={file === null || fileUploaded}
                onClick={handleFileUpload}
              >
                Upload
              </button>
            )}
            {uploading && (
              <button className="btn btn-sm w-full mt-3" disabled={true}>
                <span className="loading loading-spinner"></span>
              </button>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
};
export default ChatBot;
