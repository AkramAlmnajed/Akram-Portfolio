import React, { useEffect, useRef, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { navLinksdata } from "../../constants";
import { getLenis } from "../layouts/lenisStore";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [activeId, setActiveId] = useState("home");
  const menuButtonRef = useRef(null);
  const menuRef = useRef(null);

  // Existing behavior: lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = showMenu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMenu]);

  // a11y: Escape-to-close, focus trap, focus return (isolated; only reads/sets showMenu).
  useEffect(() => {
    if (!showMenu) return undefined;
    const menuEl = menuRef.current;
    const opener = menuButtonRef.current;

    const getFocusable = () =>
      menuEl
        ? Array.from(
            menuEl.querySelectorAll(
              'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
          )
        : [];

    const focusable = getFocusable();
    (focusable[0] || menuEl)?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowMenu(false);
        return;
      }
      if (event.key === "Tab") {
        const items = getFocusable();
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      opener?.focus();
    };
  }, [showMenu]);

  // Active-section spy (replaces react-scroll's spy) — drives the gold underline.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return undefined;
    const sections = navLinksdata
      .map(({ link }) => document.getElementById(link))
      .filter(Boolean);
    if (sections.length === 0) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((section) => io.observe(section));
    return () => io.disconnect();
  }, []);

  // Anchor nav: glide via Lenis when present; otherwise fall back to the native
  // #anchor jump (reduced-motion / Lenis off), which uses scroll-padding-top.
  const handleNav = (event, link) => {
    const lenis = getLenis();
    const target = document.getElementById(link);
    if (lenis && target) {
      event.preventDefault();
      lenis.scrollTo(target, { offset: -80 });
    }
    setShowMenu(false);
  };

  const linkClass = (link) =>
    `nav-link cursor-pointer font-medium text-inkMuted tracking-wide transition-colors duration-base ease-out hover:text-ink${
      activeId === link ? " active" : ""
    }`;

  return (
    <div className="w-full h-20 fixed top-0 z-50 bg-bg/70 backdrop-blur-md mx-auto flex justify-between items-center border-b border-line px-4 md:px-8">
      <div className="font-titleFont font-semibold text-ink text-xl md:text-2xl tracking-tight">
        Welcome To My World
      </div>

      <div className="flex items-center justify-end">
        <ul className="hidden mdl:inline-flex items-center gap-7 lg:gap-10 pr-4 font-bodyFont">
          {navLinksdata.map(({ _id, title, link }) => (
            <li className="text-sm" key={_id}>
              <a href={`#${link}`} onClick={(e) => handleNav(e, link)} className={linkClass(link)}>
                {title}
              </a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          ref={menuButtonRef}
          onClick={() => setShowMenu((value) => !value)}
          aria-label="Open menu"
          aria-expanded={showMenu}
          aria-controls="mobile-menu"
          className="goldHover overflow-hidden text-xl mdl:hidden bg-surface w-10 h-10 inline-flex items-center justify-center rounded-control text-ink cursor-pointer border border-line transition-[color,transform] duration-base ease-out active:scale-[0.97]"
        >
          <FiMenu />
        </button>
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
                aria-label="Close menu"
                onClick={() => setShowMenu(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
              />

              <motion.div
                ref={menuRef}
                id="mobile-menu"
                role="dialog"
                aria-modal="true"
                aria-label="Site menu"
                tabIndex={-1}
                initial={{ x: "100%", opacity: 0.95 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0.95 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                className="w-[84%] h-screen overflow-scroll fixed top-0 right-0 bg-bg p-6 scrollbar-hide border-l border-line will-change-transform outline-none"
              >
                <div className="flex flex-col gap-10 py-8 relative">
                  <ul className="flex flex-col gap-5 font-bodyFont">
                    {navLinksdata.map((item) => (
                      <li key={item._id} className="text-base">
                        <a
                          href={`#${item.link}`}
                          onClick={(e) => handleNav(e, item.link)}
                          className={linkClass(item.link)}
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col gap-4">
                    <h2 className="font-monoFont text-mono uppercase tracking-[0.2em] text-inkMuted mb-1">
                      Connect
                    </h2>
                    <div className="flex gap-4">
                      <a
                        href="https://github.com/AkramAlmnajed"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bannerIcon"
                        aria-label="GitHub profile"
                      >
                        <FaGithub />
                      </a>
                      <a
                        href="https://www.linkedin.com/in/akram-almnajed-5a06801a6/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bannerIcon"
                        aria-label="LinkedIn profile"
                      >
                        <FaLinkedinIn />
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowMenu(false)}
                    aria-label="Close menu"
                    className="absolute top-0 right-0 text-inkMuted hover:text-ink transition-colors duration-base ease-out text-2xl cursor-pointer"
                  >
                    <MdClose />
                  </button>
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
