

import React, { useState } from "react";
import AuthPage from "./components/ui/AuthPage";
import LogoTest from "./components/LogoTest";
import BlogPostForm from "./components/BlogPostForm";

export default function App() {
  const [user, setUser] = useState(null);

  // Handler to be called after login
  const handleLogin = (userData) => {
    setUser(userData);
  };

  return user ? (
    <>
      <LogoTest userId={user.id} />
      <BlogPostForm userId={user.id} />
    </>
  ) : (
    <AuthPage onLogin={handleLogin} />
  );
}
