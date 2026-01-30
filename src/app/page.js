"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Login from "@/app/components/Login";
import { uid, loadLocal } from "@/app/utils/storage";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");

  function login() {
    if (!name.trim()) return;

    let users = loadLocal("users", []);
    let user = users.find((u) => u.name === name && u.pass === pass );

    if (!user) {
      user = { id: uid(), name , pass };
      users.push(user);
      localStorage.setItem("users", JSON.stringify(users));
    }

    sessionStorage.setItem("currentUser", JSON.stringify(user));
    router.replace("/chat");
  }

  return <Login name={name} pass={pass} setName={setName} setPass={setPass} onLogin={login} />;
}
