"use client";
import { LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
// data
import { sidebarSections } from "../data/data";

export default function Sidenav({ activeSection, setActiveSection }) {
  const { toggleSidebar, isOpen } = useSidebar();

  console.log(toggleSidebar,isOpen);
  
  return (
    <Sidebar
      collapsible="icon"
      className="flex flex-col h-screen border-r border-gray-700 bg-gray-900"
    >
      {/* HEADER */}
      <SidebarHeader className="flex flex-row gap-x-3 items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-gray-100 truncate">Chatee</h2>
        <SidebarTrigger className="[&_svg]:size-6! hover:bg-transparent! text-gray-500 hover:text-white" />
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="custom-scrollbar flex-1 overflow-y-auto bg-gray-900 px-2">
        <SidebarMenu className="flex flex-col gap-1 px-2 py-3">
          {sidebarSections.map(({ label, value, Icon }) => {
            const active = activeSection === value;

            return (
              <SidebarMenuItem key={value}>
                <SidebarMenuButton
                  onClick={() => setActiveSection(value)}
                  className={`
                    flex items-center gap-3 rounded-lg
                    px-3 py-2 md:py-2.5
                    transition-all
                    ${
                      active
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }
                    ${!isOpen ? "justify-center px-0" : ""}
                  `}
                >
                  {/* ICON */}
                  <Icon
                    className="
                      shrink-0
                      size-17
                      md:size-5
                      lg:size-6
                    "
                    size={17}
                  />

                  {/* LABEL */}
                  {isOpen && (
                    <span className="text-sm md:text-sm font-medium truncate text-white">
                      label
                    </span>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="border-t border-gray-700 bg-gray-900 p-4">
        <SidebarMenuButton
          className="
            flex items-center gap-3
            text-red-500 hover:text-red-400
            hover:bg-gray-800
            rounded-lg px-3 py-2
          "
        >
          <LogOut className="size-5 md:size-5 lg:size-6" />
          {isOpen && <span className="text-sm">Logout</span>}
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
