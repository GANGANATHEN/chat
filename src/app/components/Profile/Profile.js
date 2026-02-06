import Image from "next/image";
import React from "react";
// useContext
import { useChat } from "../../context/ChatContext";

const Profile = ({ openProfile }) => {
  const { currentUser } = useChat();

  return (
    <header className="h-12 w-full bg-gray-900 border-b border-gray-700 flex items-center px-3 text-white">
      {/* Logo */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="font-semibold text-sm">ChatApp</span>
      </div>
      <div className="flex-1" />

      {/*  User */}
      <div
        onClick={() => openProfile(currentUser)}
        className="flex items-center gap-2 min-w-0 cursor-pointer"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">
            {currentUser?.name[0].toUpperCase()}
          </div>
          <span className="text-sm truncate max-w-30 sm:max-w-50">
            {currentUser?.name}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Profile;
