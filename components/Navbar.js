"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const { signOut } = useClerk();
  const { isSignedIn, userId } = useAuth();

  const handleLogout = () => {
    signOut(() => {
      router.push("/auth/signin");
    });
  };

  return (
    <div
      className="flex justify-between items-center px-14 h-20 
      border-b-1 border-b-gray-700"
    >
      <Link href="/">
        <div className="flex items-center gap-3">
          <Image src="/cloudit-logo.png" height={30} width={30} alt="logo" />
          <p className="font-semibold text-2xl text-white">Cloudit.</p>
        </div>
      </Link>

      {isSignedIn ? (
        <div className="flex gap-4 items-center">
          <button
            onClick={handleLogout}
            className="border-darkblue-500 border-2 px-4 py-2 rounded-full text-white font-semibold text-sm cursor-pointer transition"
          >
            Log Out
          </button>
        </div>
      ) : (
        <div className="flex gap-7 items-center">
          <Link href="/auth/signin">
            <button className="px-4 py-2 rounded-full text-white font-semibold text-sm cursor-pointer bg-darkblue-500 transition">
              Sign In
            </button>
          </Link>

          <Link href="/auth/signup">
            <button className="border-darkblue-500 border-2 px-4 py-2 rounded-full text-white font-semibold text-sm cursor-pointer transition">
              Sign Up
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
