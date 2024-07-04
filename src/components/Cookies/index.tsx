"use client";
import React, { useState, useEffect } from "react";
import Cookie from "js-cookie";
import { Button } from "../ui/button";
import { CookieIcon } from "lucide-react";

const Cookies = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = Cookie.get("cookie_consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    Cookie.set("cookie_consent", "accepted", { expires: 365 });
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="cookie-consent-banner fixed bottom-3 left-3 right-3 z-50 rounded border bg-accent p-6 text-base">
      <p className=" mb-3 text-xl">
        We use cookies to improve your experience. By using our site, you agree
        to our use of cookies.
      </p>
      <Button onClick={acceptCookies}>
        <CookieIcon className="mr-1 h-5 w-5" /> Accept Cookies
      </Button>
    </div>
  );
};

export default Cookies;
