"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Login from "@/app/components/Login";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const router = useRouter();

  //  already logged-in user redirect
  useEffect(() => {
    const user = sessionStorage.getItem("currentUser");
    if (user) {
      router.replace("/chat");
    }
  }, [router]);

  function login() {
    if (!name.trim() || !pass.trim()) return;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find((u) => u.name === name && u.pass === pass);

    if (!user) {
      // new user
      user = {
        id: Date.now().toString(),
        name,
        pass,
        isOnline: true,
        lastSeen: null,
      };
      users.push(user);
    } else {
      // existing user
      user.isOnline = true;
      user.lastSeen = null;
      users = users.map((u) => (u.id === user.id ? user : u));
    }

    localStorage.setItem("users", JSON.stringify(users));
    sessionStorage.setItem("currentUser", JSON.stringify(user));

    router.replace("/chat");
  }

  return (
    <Login
      name={name}
      pass={pass}
      setName={setName}
      setPass={setPass}
      onLogin={login}
    />
  );
}
