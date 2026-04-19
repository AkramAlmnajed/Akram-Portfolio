import React, { useEffect, useState } from "react";
import { Link } from "react-scroll";
import { FiMenu } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { navLinksdata } from "../../constants";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showMenu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMenu]);

  return (
    <div className="w-full h-20 fixed top-0 z-50 bg-[#091024]/95 backdrop-blur-lg mx-auto flex justify-between items-center font-titleFont border-b border-b-slate-700/70 px-4 md:px-8">
      <div className="text-slate-100 text-sm md:text-base font-semibold tracking-[0.14em] uppercase">
        Welcome To My World
      </div>

      <div className="flex items-center justify-end">
        <ul className="hidden mdl:inline-flex items-center gap-7 lg:gap-10 pr-4">
          {navLinksdata.map(({ _id, title, link }) => (
            <li
              className="text-sm font-medium text-slate-400 tracking-wide cursor-pointer hover:text-designColor duration-300"
              key={_id}
            >
              <Link
                activeClass="active"
                to={link}
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
              >
                {title}
              </Link>
            </li>
          ))}
        </ul>
        <span
          onClick={() => setShowMenu(!showMenu)}
          className="text-xl mdl:hidden bg-slate-900 w-10 h-10 inline-flex items-center justify-center rounded-full text-designColor cursor-pointer border border-slate-700"
        >
          <FiMenu />
        </span>
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[60] mdl:hidden"
            >
              <motion.button
                type="button"
                aria-label="Close mobile menu"
                onClick={() => setShowMenu(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 bg-[#020617]/70 backdrop-blur-[2px]"
              />

              <motion.div
                initial={{ x: "100%", opacity: 0.95 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0.95 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                className="w-[84%] h-screen overflow-scroll fixed top-0 right-0 bg-[#091024] p-6 scrollbar-hide border-l border-l-slate-700/60 will-change-transform"
              >
                <div className="flex flex-col gap-10 py-8 relative">
                  <ul className="flex flex-col gap-5">
                    {navLinksdata.map((item) => (
                      <li
                        key={item._id}
                        className="text-base font-medium text-slate-300 tracking-wide cursor-pointer hover:text-designColor duration-300"
                      >
                        <Link
                          onClick={() => setShowMenu(false)}
                          activeClass="active"
                          to={item.link}
                          spy={true}
                          smooth={true}
                          offset={-70}
                          duration={500}
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col gap-4">
                    <h2 className="text-xs uppercase font-titleFont mb-2 tracking-[0.22em] text-slate-400">
                      Connect
                    </h2>
                    <div className="flex gap-4">
                      <a
                        href="https://github.com/AkramAlmnajed"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bannerIcon"
                      >
                        <FaGithub />
                      </a>
                      <a
                        href="https://www.linkedin.com/in/akram-almnajed-5a06801a6/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bannerIcon"
                      >
                        <FaLinkedinIn />
                      </a>
                    </div>
                  </div>
                  <span
                    onClick={() => setShowMenu(false)}
                    className="absolute top-0 right-0 text-slate-400 hover:text-designColor duration-300 text-2xl cursor-pointer"
                  >
                    <MdClose />
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Navbar;
