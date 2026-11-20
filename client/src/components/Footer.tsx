import React from "react";
import { Button } from "./ui/button";
import { Mail } from "lucide-react";
import { FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";

function Footer() {
  return (
    <div className="bg-black">
      <div className="text-white flex flex-col items-center px-4 pt-14 sm:pt-20">
        <p className="text-blue-500 font-semibold text-lg">STUDENT SUPPORT</p>
        <h1 className="text-4xl text-center font-bold mt-4 sm:text-6xl">
          Need <span className="text-blue-700">help?</span>
        </h1>
        <p className="text-gray-400 text-base text-center max-w-3xl mt-6 sm:text-xl">
          Have a question or need assistance? Email us at
          <span className="text-blue-700"> gethelp.codex@gmail.com</span>, and
          our support team will get back to you within
          <span className="text-white font-bold">24 hours.</span>
        </p>
        <Button className="mt-8 bg-white text-black hover:bg-gray-200 px-6 py-6 rounded-lg cursor-pointer">
          <Mail />
          Email support
        </Button>
      </div>
      <div>
        <div className="bg-gray-950 rounded-3xl border border-gray-800 mt-20 m-6">
          <div className="grid grid-cols-1 gap-8 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4 lg:gap-10 lg:p-10">
            <div>
              <div className="flex items-center gap-3">
                <img
                  src="/logo.jpeg"
                  alt="100xDevs"
                  className="h-12 w-12 rounded-full"
                />

                <h2 className="text-3xl font-bold text-white">
                  CODE<span className="text-red-500">X</span>
                </h2>
              </div>

              <p className="mt-6 text-sm leading-8 text-gray-400">
                Coding cohorts, bootcamps, projects, and mentorship by 100xDevs.
              </p>
            </div>
            <div>
              <h3 className="mb-5 text-lg font-bold text-white">Learn</h3>

              <div className="flex flex-col gap-3 text-sm text-white">
                <p>100xDevs Bootcamp</p>
                <p>100xDevs Cohort</p>
                <p>Full Stack Cohort</p>
                <p>DevOps Bootcamp</p>
                <p>Web3 Bootcamp</p>
                <p>AI Bootcamp</p>
              </div>
            </div>

            <div>
              <h3 className="mb-5 text-lg font-bold text-white">100xDevs</h3>

              <div className="flex flex-col gap-3 text-sm text-white">
                <p>Courses</p>
                <p>About</p>
                <p>Learner app</p>
                <p>Course platform</p>
                <p>Terms & Conditions</p>
                <p>Privacy Policy</p>
                <p>Refund & Cancellation</p>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap gap-4">
                <p className="flex h-10 w-10 bg-white items-center justify-center rounded-sm border border-gray-800">
                  <FaYoutube size={20} />
                </p>

                <p className="flex h-10 w-10 bg-white items-center justify-center rounded-sm border border-gray-800">
                  <FaTwitter className="bg-white" size={20} />
                </p>

                <p className="flex h-10 w-10 bg-white items-center justify-center rounded-sm border border-gray-800">
                  <FaInstagram size={20} />
                </p>

                <p className="flex h-10 w-10 bg-white items-center justify-center rounded-sm border border-gray-800">
                  <FaLinkedin size={20} />
                </p>
              </div>

              <p className="mt-4 text-sm text-gray-400">
                © 2026 100xDevs. All rights reserved.
              </p>
            </div>
          </div>
        </div>

        <div className="pointer-events-none mx-auto mt-12 max-w-full select-none text-center text-[clamp(3.4rem,16vw,12rem)] font-black leading-none text-blue-950 opacity-80 sm:mt-16 overflow-hidden">
          100xDevs
        </div>
      </div>
    </div>
  );
}

export default Footer;
