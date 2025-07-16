"use client";
import React, { useState } from "react";
import { HiOutlineMail } from "react-icons/hi";
import { FaRegEye, FaRegEyeSlash, FaRegUser } from "react-icons/fa";
import { useSignUp } from "@clerk/nextjs";
import Link from "next/link";
import VerificationCodeInput from "@/components/VerificationCodeInput";

const SignUp = () => {
  const { isLoaded, signUp } = useSignUp();
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);

  if (!isLoaded) return null;

  const handleSignUp = async () => {
    if (!isLoaded) return;
    if (!userDetails.email || !userDetails.password || !userDetails.username)
      return;

    try {
      await signUp.create({
        username: userDetails.username,
        emailAddress: userDetails.email,
        password: userDetails.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-custom-gradient h-screen w-screen justify-center flex">
      {pendingVerification ? (
        <VerificationCodeInput />
      ) : (
        <div className="px-10 py-5 h-[70%] border-1 border-gray-700 w-[30%] mt-26 bg-bgblue-500 rounded-xl flex flex-col gap-4">
          <p className="text-white font-semibold text-2xl text-center">
            Sign Up
          </p>

          <div className="w-full gap-2 flex flex-col">
            <p className="text-white font-semibold text-balance">Username</p>
            <div className="bg-[rgba(255,255,255,0.1)] flex items-center gap-3 rounded-md">
              <input
                onChange={(e) =>
                  setUserDetails({ ...userDetails, username: e.target.value })
                }
                placeholder="Enter your username..."
                className="pl-4 w-[88%] text-white py-2 outline-none"
                type="text"
              />
              <FaRegUser className="text-white" size={17} />
            </div>
          </div>

          <div className="gap-5 flex flex-col border-b-1 border-b-gray-700 pb-8">
            <div className="w-full gap-2 flex flex-col">
              <p className="text-white font-semibold text-balance">Email</p>
              <div className="bg-[rgba(255,255,255,0.1)] flex items-center gap-3 rounded-md">
                <input
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, email: e.target.value })
                  }
                  placeholder="Enter your email..."
                  className="pl-4 w-[88%] text-white py-2 outline-none"
                  type="text"
                />
                <HiOutlineMail className="text-white" size={20} />
              </div>
            </div>

            <div className="w-full gap-2 flex flex-col">
              <p className="text-white font-semibold text-md">Password</p>
              <div className="bg-[rgba(255,255,255,0.1)] flex items-center gap-3 rounded-md">
                <input
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, password: e.target.value })
                  }
                  placeholder="Enter your password..."
                  className="pl-4 w-[88%] text-white py-2 outline-none"
                  type={isPasswordVisible ? "text" : "password"}
                />
                <div
                  className="cursor-pointer"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? (
                    <FaRegEye className="text-white" size={20} />
                  ) : (
                    <FaRegEyeSlash className="text-white" size={20} />
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleSignUp}
              className="mt-3 px-4 py-2 rounded-lg text-white font-semibold text-sm cursor-pointer bg-darkblue-500 transition"
            >
              Create Account
            </button>
          </div>

          <span className="text-center">
            Already have an account?{" "}
            <Link href="/auth/signin">
              <span className="text-darkblue-500 cursor-pointer font-semibold">
                Sign In
              </span>
            </Link>
          </span>
        </div>
      )}
    </div>
  );
};

export default SignUp;
