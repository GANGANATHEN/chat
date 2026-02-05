import React from "react";
import { X } from "lucide-react";

const ProfileModal = ({ user, onClose, getChatTitle, chat, userMap, currentUser }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-gray-900 text-white rounded-2xl shadow-xl border border-gray-800">
        
        {/* Header */}
        <div className="h-24 bg-linear-to-r from-blue-600 to-purple-600 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="cursor-pointer absolute top-3 right-3 text-white/80 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex justify-center -mt-12">
          {/* <img
            src={
              user.avatar ||
              `https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff`
            }
            alt="profile"
            className="w-24 h-24 rounded-full border-4 border-gray-900 object-cover"
          /> */}
          Image
        </div>

        {/* User Info */}
        <div className="px-6 py-4 text-center">
          <h2 className="text-lg font-semibold">{userMap[user?.id]?.name}</h2>
          <p className="text-sm text-gray-400">
            {user.email || "No email provided"}
          </p>
          <p>{user.id}</p>

          {/* About */}
          {user.about && (
            <p className="mt-3 text-sm text-gray-300">
              {user.about}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
