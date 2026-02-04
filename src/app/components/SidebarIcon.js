"use client";
import React, { useState, useEffect } from "react";
import { LogOut, ChessPawn } from "lucide-react";
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

export default function Sidenav({
  activeSection,
  setActiveSection,
  onOpen,
  isMobile,
  onLogout,
}) {
  const { setOpen } = useSidebar();
  const [isClose, setIsClose] = useState(false);

  useEffect(() => {
    if (!isMobile) {
      setOpen(false);
    }
  }, [isMobile, setOpen]);

  // console.log(isMobile);

  return (
    <div
      className={`${isMobile ? "relative h-full" : "fixed top-0 left-0 z-50 h-full"}`}
    >
      <Sidebar
        collapsible="icon"
        className="flex flex-col border-r border-gray-700 bg-gray-900"
      >
        {/* HEADER */}
        <SidebarHeader
          className={`h-12 flex flex-row gap-x-3 items-center justify-between px-2.5 py-2
           bg-gray-900 border-b border-gray-700 ${isClose ? "px-4" : ""}`}
        >
          {isClose && (
            <h2 className="text-lg font-semibold text-gray-100 truncate">
              Chatee
            </h2>
          )}

          <SidebarTrigger
            onClick={() => {
              setIsClose((pre) => !pre);
            }}
            className={`${!isMobile ? "hidden" : ""} [&_svg]:size-6! hover:bg-transparent! text-gray-500 hover:text-white`}
          />

          {!isMobile && (
            <ChessPawn className="text-gray-500 hover:text-white" />
          )}
        </SidebarHeader>

        {/* CONTENT */}
        <SidebarContent className="custom-scrollbar flex-1 overflow-y-auto bg-gray-900 px-2">
          <SidebarMenu className="flex flex-col gap-1 py-2">
            {sidebarSections.map(({ label, value, Icon }) => {
              const active = activeSection === value;

              return (
                <SidebarMenuItem key={value}>
                  <SidebarMenuButton
                    onClick={() => {
                      setActiveSection(value);
                      onOpen();
                    }}
                    className={`
                    flex items-center rounded-lg
                    
                    transition-all
                    ${
                      active
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }
                    ${isClose ? "items-center px-2" : ""}
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
                    {isClose && (
                      <span className="text-sm md:text-sm font-medium truncate text-white">
                        {label}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

        {/* FOOTER */}
        <SidebarFooter className="border-t border-gray-700 bg-gray-900">
          <SidebarMenuButton
            onClick={onLogout}
            className={`
            flex items-center
            text-red-500 hover:text-red-400
            hover:bg-gray-800
            rounded-lg px-1.5 py-2 cursor-pointer
            ${isClose ? "px-3" : ""}
          `}
          >
            <LogOut className="size-5 md:size-5 lg:size-6" />
            {isClose && <span className="text-sm">Logout</span>}
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}
