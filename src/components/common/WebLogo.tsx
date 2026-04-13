"use client";

import Image from "next/image";
import React from "react";

type WebLogoProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

export const WebLogo: React.FC<WebLogoProps> = ({
  className = "h-10 w-10",
  imageClassName = "rounded-2xl object-cover",
  priority = false,
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src="/android-chrome-192x192.png"
        alt="Website logo"
        fill
        sizes="40px"
        className={imageClassName}
        priority={priority}
      />
    </div>
  );
};
