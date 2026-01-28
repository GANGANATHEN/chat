import { loadLocal } from "../utils/storage";
import { Users, MessageCircle, LogOut } from "lucide-react";

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

  return (
    <div
      className={`${isMobile ? `relative` : `fixed top-0 left-0 z-50  h-full`}`}
    >
      <Sidebar
        className={`
    flex flex-col transition-all duration-300 ease-in-out
     bg-gray-700 border-r-2 border-gray-800 h-screen
  `}
      >
        <SidebarHeader className="flex flex-row items-center justify-between px-3 py-3 border-b border-gray-800">
          <h2 className="font-semibold text-lg truncate">Chats</h2>

          <SidebarTrigger />
        </SidebarHeader>

        <SidebarContent className="space-y-6 overflow-y-auto">
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2">
              <Users size={16} /> Users
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {users
                  .filter((u) => u.id !== currentUser.id)
                  .map((u) => (
                    <SidebarMenuItem key={u.id}>
                      <SidebarMenuButton
                        onClick={() => {
                          openPrivateChat(u);
                          if (!isMobile) toggleSidebar();
                        }}
                        className="flex items-center gap-3"
                      >
                        <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold text-white">
                          {u.name[0].toUpperCase()}
                        </div>
                        <span className="truncate">{u.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* GROUP CHATS */}
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2">
              <MessageCircle size={16} /> Groups
            </SidebarGroupLabel>

            <SidebarGroupContent className="space-y-2">
              <button
                onClick={createGroup}
                className="w-full py-2 rounded-lg bg-linear-to-r from-red-500 to-pink-600 text-sm font-semibold text-white"
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
                        className="flex items-center gap-3"
                      >
                        <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-sm font-bold text-white">
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

        <SidebarFooter className="border-t border-gray-800 p-3 mt-auto">
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-red-500 text-sm"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </SidebarFooter>
      </Sidebar>
      <aside
        className="flex max-md:hidden flex-col transition-all duration-300 ease-in-out
     bg-gray-700 border-r-2 border-gray-800 h-screen"
      >
        <SidebarTrigger className="size-14 [&>svg]:size-8" />
        <div className="border-t border-gray-800 p-3 mt-auto">
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-red-500 text-sm"
          >
            <LogOut size={20} />
          </button>
        </div>
      </aside>
    </div>
  );
}
