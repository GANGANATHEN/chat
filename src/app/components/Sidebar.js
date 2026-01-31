import React, { useState, useMemo } from "react";
import { loadLocal } from "../utils/storage";
import { Users, MessageCircle, LogOut, MessageSquareText } from "lucide-react";
import UserProfile from "./UserProfile";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

export default function Sidenav({
  currentUser,
  chats,
  onLogout,
  openPrivateChat,
  createGroup,
  setActiveChat,
  isMobile,
  openProfile,
  sidebarItems,
  openChat,
}) {
  const users = loadLocal("users", []);
  const { toggleSidebar, isOpen } = useSidebar();
  
  const sortedSidebarItems = useMemo(() => {
    return [...sidebarItems].sort((a, b) => {
      // both have messages → recent first
      if (a.lastMessageAt && b.lastMessageAt) {
        return b.lastMessageAt - a.lastMessageAt;
      }

      // only one has messages
      if (a.lastMessageAt && !b.lastMessageAt) return -1;
      if (!a.lastMessageAt && b.lastMessageAt) return 1;

      // no messages → alphabetical
      return a.title.localeCompare(b.title);
    });
  }, [sidebarItems]);

  const otherUsers = users?.filter((u) => u.id !== currentUser.id);

  return (
    <div
      className={`${isMobile ? "relative" : "fixed top-0 left-0 z-50 h-full"}`}
    >
      <Sidebar className="flex flex-col h-screen border-r border-gray-700 bg-gray-900">
        {/* HEADER */}
        <SidebarHeader className="flex flex-row gap-x-3 items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-gray-100 truncate">
            Chatee
          </h2>
          <SidebarTrigger className="[&_svg]:size-6! hover:bg-transparent! text-gray-500 hover:text-white" />
        </SidebarHeader>

        {/* CONTENT */}
        <SidebarContent className="custom-scrollbar flex-1 overflow-y-auto bg-gray-900 px-2">
          {/* Profile */}
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-x-2 px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Profile
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem key={currentUser.id}>
                  <SidebarMenuButton
                    onClick={() => openProfile(currentUser)}
                    className="flex items-center gap-3 py-6 rounded-lg text-gray-200 hover:bg-gray-800 
                    hover:text-white/40 transition"
                  >
                    <div className="h-9 w-9 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-semibold text-white">
                      {currentUser.name[0].toUpperCase()}
                    </div>
                    <span className="truncate">{currentUser.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* All Chats */}
          {/* <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-x-2 px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
              <MessageSquareText size={14} /> All Chats
            </SidebarGroupLabel>

            <SidebarGroupContent
              className={`sidebar-scroll-height custom-scrollbar`}
            >
              <SidebarMenu>
                {sortedSidebarItems.length > 0 ? (
                  sortedSidebarItems.map((item) => (
                    <SidebarMenuItem key={item.chatId} className="py-1">
                      <SidebarMenuButton
                        onClick={() => {
                          openChat(item.chatId);
                          if (!isMobile) toggleSidebar();
                        }}
                        className="flex items-center gap-3 py-6 rounded-lg
                     text-gray-200 hover:bg-gray-800 transition"
                      >
                        <div
                          className="h-9 w-9 rounded-full bg-indigo-500
                          flex items-center justify-center
                          text-sm font-semibold text-white"
                        >
                          {item.avatarLetter.toUpperCase()}
                        </div>

                        <span className="flex-1 truncate">{item.title}</span>

                        {item.unreadCount > 0 && (
                          <span
                            className="ml-auto min-w-4.5 h-4.5
                             text-xs bg-blue-600 text-white
                             rounded-full flex items-center
                             justify-center"
                          >
                            {item.unreadCount}
                          </span>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No chats
                  </div>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup> */}

          {/* USERS */}
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-x-2 px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
              <Users size={14} /> Users
            </SidebarGroupLabel>

            <SidebarGroupContent
              className={`sidebar-scroll-height custom-scrollbar`}
            >
              <SidebarMenu>
                {otherUsers && otherUsers.length > 0 ? (
                  otherUsers
                    .slice()
                    .sort((a, b) => {
                      // sort alphabetically by name
                      const nameCompare = a.name.localeCompare(b.name);
                      if (nameCompare !== 0) return nameCompare;

                      // if names are same, sort by id
                      return a.id.localeCompare(b.id);
                    })
                    .map((u) => (
                      <SidebarMenuItem key={u.id} className={`py-1`}>
                        <SidebarMenuButton
                          onClick={() => {
                            openPrivateChat(u);
                            if (!isMobile) toggleSidebar();
                          }}
                          className="
                      flex items-center gap-3 py-6 rounded-lg
                      text-gray-200
                      hover:bg-gray-800
                      hover:text-white/40
                      transition-colors
                    "
                        >
                          <div
                            className="
                      h-9 w-9 rounded-full
                      bg-indigo-500
                      flex items-center justify-center
                      text-sm font-semibold text-white
                    "
                          >
                            {u.name[0].toUpperCase()}
                          </div>

                          <span className="truncate">{u.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No other users available
                  </div>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* GROUPS */}
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-x-2 px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
              <MessageCircle size={14} /> Groups
            </SidebarGroupLabel>

            <SidebarGroupContent className={`space-y-3 px-2 py-2.5`}>
              <button
                onClick={createGroup}
                className="
              w-full py-2 rounded-lg
              bg-linear-to-r from-indigo-500 to-blue-600
              text-sm font-semibold text-white
              hover:opacity-90
              transition
            "
              >
                + Create Group
              </button>

              <SidebarMenu
                className={`sidebar-scroll-height custom-scrollbar space-y-3 px-2 py-2.5`}
              >
                {chats
                  .filter(
                    (c) =>
                      c.type === "group" &&
                      c.members.some((m) => m.id === currentUser.id),
                  )
                  .slice()
                  .sort((a, b) => {
                    const nameCompare = a.name.localeCompare(b.name);
                    if (nameCompare !== 0) return nameCompare;
                    return a.id.localeCompare(b.id);
                  })
                  .map((c) => (
                    <SidebarMenuItem key={c.id}>
                      <SidebarMenuButton
                        onClick={() => {
                          setActiveChat(c.id);
                          if (!isMobile) toggleSidebar();
                        }}
                        className="
          flex items-center gap-3 py-6 rounded-lg
          text-gray-200
          hover:bg-gray-800
          hover:text-white/40
          transition-colors
        "
                      >
                        <div
                          className="
            h-9 w-9 rounded-full
            bg-red-500
            flex items-center justify-center
            text-sm font-semibold text-white
          "
                        >
                          {c.name[0].toUpperCase()}
                        </div>

                        <span className="truncate">{c.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* FOOTER */}
        <SidebarFooter className="border-t border-gray-700 bg-gray-900 p-4">
          <button
            onClick={onLogout}
            className="
          flex items-center gap-2
          text-sm text-red-500
          hover:text-red-400
          transition
        "
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </SidebarFooter>
      </Sidebar>
      <aside
        className="flex max-md:hidden flex-col items-center py-3 transition-all duration-300 ease-in-out
       bg-gray-900 border-r-2 border-gray-700 h-screen"
      >
        <SidebarTrigger className="[&_svg]:size-6! hover:bg-transparent! text-gray-500 hover:text-white" />
        <div className="border-t border-gray-800 p-3 mt-auto">
          <button
            onClick={onLogout}
            className="flex items-center gap-2 cursor-pointer text-red-500 hover:text-red-400 text-sm"
          >
            <LogOut size={20} />
          </button>
        </div>
      </aside>
    </div>
  );
}
