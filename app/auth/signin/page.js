"use client";
import React, { useState } from "react";
import { HiOutlineMail } from "react-icons/hi";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [userDetails, setUserDetails] = useState({
    identifier: "",
    password: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  if (!isLoaded) return null;

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const result = await signIn.create({
        identifier: userDetails.identifier,
        password: userDetails.password,
      });

      await setActive({ session: result.createdSessionId });
      router.push("/");
      // Redirect after signin
    } catch (err) {
      console.error("Error signing in: ", err.errors);
    }
  };
  return (
    <div className="bg-custom-gradient h-[calc(100vh-5rem)] w-screen justify-center flex">
      <div className="px-10 py-5 h-[65%] border-1 border-gray-700 w-[30%] mt-16 bg-bgblue-500 rounded-xl flex flex-col gap-4">
        <p className="text-white font-semibold text-2xl text-center">Sign In</p>

        <div className="gap-5 flex flex-col border-b-1 border-b-gray-700 pb-8">
          <div className="w-full gap-2 flex flex-col">
            <p className="text-white font-semibold text-balance">Email</p>
            <div className="bg-[rgba(255,255,255,0.1)] flex items-center gap-3 rounded-md">
              <input
                onChange={(e) =>
                  setUserDetails({ ...userDetails, identifier: e.target.value })
                }
                placeholder="Enter username or email..."
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

          <button onClick={handleSignIn} className="mt-3 px-4 py-2 rounded-lg text-white font-semibold text-sm cursor-pointer bg-darkblue-500 transition">
            Sign In
          </button>
        </div>

        <span className="text-center">
          Don't have an account?{" "}
          <Link href="/auth/signup">
            <span className="text-darkblue-500 cursor-pointer font-semibold">
              Sign Up
            </span>
          </Link>
        </span>
      </div>
    </div>
  );
};

export default SignIn;
