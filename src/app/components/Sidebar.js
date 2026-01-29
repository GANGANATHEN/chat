import { loadLocal } from "../utils/storage";
import { Users, MessageCircle, LogOut, PanelLeftIcon } from "lucide-react";

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
}) {
  const users = loadLocal("users", []);
  const { toggleSidebar, isOpen } = useSidebar();

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
        <SidebarContent className="flex-1 space-y-6 overflow-y-auto bg-gray-900 px-2">
          {/* USERS */}
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2 px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
              <Users size={14} /> Users
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {otherUsers && otherUsers.length > 0 ? (
                  otherUsers.map((u) => (
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
            <SidebarGroupLabel className="flex items-center gap-2 px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
              <MessageCircle size={14} /> Groups
            </SidebarGroupLabel>

            <SidebarGroupContent className="space-y-3 px-2 py-2.5">
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

              <SidebarMenu>
                {chats
                  .filter(
                    (c) =>
                      c.type === "group" && c.members.includes(currentUser.id),
                  )
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
