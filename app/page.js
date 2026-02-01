"use client";

import React from "react";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";

const Home = () => {
  const { isSignedIn, userId } = useAuth();
  return (
    <div className="flex justify-center items-center gap-12 mt-32">
      <div className="flex flex-col gap-5">
        <span className="text-5xl font-semibold">
          <span className="text-darkblue-500 text-gradient">Store </span>your files.
        </span>
        <span className="text-5xl font-semibold">
          <span className="text-darkblue-500 text-gradient">Share </span>with anyone.
        </span>
        <span className="text-5xl font-semibold">
          <span className="text-darkblue-500 text-gradient">Access </span>from anywhere.
        </span>
      </div>

      <div
        className="p-4 rounded-full flex justify-center items-center h-[450px] w-[450px]"
        style={{
          background: `radial-gradient(circle, 
            rgba(0,32,253,0.7) 0%,
            rgba(0,32,253,0.7) 15%,
            rgba(0,32,253,0.5) 15%,
            rgba(0,32,253,0.5) 30%,
            rgba(0,32,253,0.35) 30%,
            rgba(0,32,253,0.35) 45%,
            rgba(0,32,253,0.25) 45%,
            rgba(0,32,253,0.25) 60%,
            rgba(0,32,253,0.15) 60%,
            rgba(0,32,253,0.15) 75%,
            rgba(0,32,253,0.05) 75%,
            rgba(0,32,253,0.05) 90%,
            transparent 90%
          )`,
        }}
      >
        <Image src="/hero-image.png" height={50} width={50} alt="logo" />
      </div>
    </div>
  );
};

export default Home;
