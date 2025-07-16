"use client";

import React, { useRef, useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const VerificationCodeInput = () => {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [codes, setCodes] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newCodes = [...codes];
      newCodes[index] = value;
      setCodes(newCodes);

      // Move to next input if value entered
      if (value && index < 5) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !codes[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    if (!isLoaded) return;
    const code = codes.join("");
    e.preventDefault();
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      await setActive({ session: completeSignUp.createdSessionId });
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4 bg-bgblue-500 h-[30%] mt-26 px-10 py-5 rounded-xl">
      <p className="text-white font-semibold text-2xl">Verification Code</p>
      <div className="flex gap-2">
        {codes.map((code, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={code}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-12 h-12 text-center text-md text-white bg-[rgba(255,255,255,0.1)] rounded-lg outline-none"
          />
        ))}
      </div>

      <button
        onClick={handleVerify}
        className="mt-3 px-6 py-2 rounded-lg text-white font-semibold text-sm cursor-pointer bg-darkblue-500 transition"
      >
        Verify User
      </button>
    </div>
  );
};

export default VerificationCodeInput;
