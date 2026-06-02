import React, { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { motion, useReducedMotion } from "framer-motion";
import Title from "../layouts/Title";
import ContactLeft from "./ContactLeft";

const DIRECT_EMAIL = "akramalmnajed@gmail.com";
const EMAILJS_CONFIG = {
  serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID || "service_w9segfo",
  templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID || "template_se2nz3h",
  publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY || "sqIwdrPSv0NmiD6Ge",
  receiverEmail: process.env.REACT_APP_CONTACT_RECEIVER_EMAIL || DIRECT_EMAIL,
};

const FORMSUBMIT_ENDPOINT = process.env.REACT_APP_FORMSUBMIT_ENDPOINT;

const initialFormData = {
  username: "",
  phoneNumber: "",
  email: "",
  subject: "",
  message: "",
};

const resolveEmailJsErrorMessage = (error) => {
  const status = Number(error?.status) || 0;
  const rawText = String(error?.text || "").trim();
  const lowerText = rawText.toLowerCase();

  if (lowerText.includes("gmail_api") && lowerText.includes("invalid grant")) {
    return "Email delivery is blocked because the Gmail connection for EmailJS service service_w9segfo has expired. Reconnect Gmail in EmailJS Dashboard > Email Services, then submit again.";
  }

  if (lowerText.includes("reconnect your gmail account")) {
    return "EmailJS requested Gmail reconnection for service service_w9segfo. Reconnect the Gmail account in EmailJS Dashboard > Email Services, then try again.";
  }

  if (lowerText.includes("template") && lowerText.includes("not found")) {
    return "Email template not found. Please verify REACT_APP_EMAILJS_TEMPLATE_ID in your EmailJS dashboard.";
  }

  if (lowerText.includes("service") && lowerText.includes("not found")) {
    return "Email service not found. Please verify REACT_APP_EMAILJS_SERVICE_ID in your EmailJS dashboard.";
  }

  if (lowerText.includes("public key") || lowerText.includes("user id")) {
    return "Public key is invalid. Please verify REACT_APP_EMAILJS_PUBLIC_KEY.";
  }

  if (lowerText.includes("origin") || lowerText.includes("domain")) {
    return "This domain is not allowed by EmailJS. Add your site URL in EmailJS Security settings (Allowed Origins).";
  }

  if (lowerText.includes("non-browser environments")) {
    return "EmailJS blocked this request because API access from non-browser environments is disabled. This setting affects curl/Postman tests and can be changed in EmailJS Security settings.";
  }

  if (status === 401 || status === 403) {
    return "EmailJS rejected the request. Verify your public key, allowed domain, and account security settings.";
  }

  if (status === 404) {
    return "EmailJS endpoint/config was not found. Confirm service and template IDs.";
  }

  if (status >= 500) {
    return "Email service is temporarily unavailable. Please try again shortly.";
  }

  if (rawText) {
    return `Email could not be sent: ${rawText}`;
  }

  return "Message could not be sent right now. Please try again shortly or email akramalmnajed@gmail.com directly.";
};

const resolveFormSubmitErrorMessage = (error) => {
  const rawText = String(error?.message || "").trim();
  const lowerText = rawText.toLowerCase();

  if (lowerText.includes("activation")) {
    return "Backup delivery needs one-time activation. Check akramalmnajed@gmail.com for the FormSubmit activation email, click Activate Form, then submit again.";
  }

  if (lowerText.includes("web server")) {
    return "Backup delivery requires running via http(s). Open the site through npm start or your deployed URL and try again.";
  }

  if (lowerText.includes("failed to fetch") || lowerText.includes("network")) {
    return "Backup delivery endpoint was unreachable due to a network issue. Please try again.";
  }

  if (rawText) {
    return rawText;
  }

  return "Backup delivery route failed.";
};

const Contact = () => {
  const reduce = useReducedMotion();
  const [formData, setFormData] = useState(initialFormData);
  const [fieldErrors, setFieldErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (EMAILJS_CONFIG.publicKey) {
      emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
    }
  }, []);

  const validateForm = () => {
    const trimmedData = {
      username: formData.username.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    };
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedData.username) {
      errors.username = "Your name is required.";
    }
    if (!trimmedData.phoneNumber) {
      errors.phoneNumber = "Phone number is required.";
    }
    if (!trimmedData.email) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(trimmedData.email)) {
      errors.email = "Please provide a valid email address.";
    }
    if (!trimmedData.subject) {
      errors.subject = "Subject is required.";
    }
    if (!trimmedData.message) {
      errors.message = "Message is required.";
    } else if (trimmedData.message.length < 10) {
      errors.message = "Message should be at least 10 characters.";
    }

    return { errors, trimmedData };
  };

  const handleInputChange = (field) => (event) => {
    const { value } = event.target;
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (status.message) {
      setStatus({ type: "", message: "" });
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    const { errors, trimmedData } = validateForm();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setStatus({
        type: "error",
        message: "Please correct the highlighted fields and try again.",
      });
      return;
    }

    if (
      !EMAILJS_CONFIG.serviceId ||
      !EMAILJS_CONFIG.templateId ||
      !EMAILJS_CONFIG.publicKey
    ) {
      setStatus({
        type: "error",
        message:
          "Contact form is not configured. Please set REACT_APP_EMAILJS_SERVICE_ID, REACT_APP_EMAILJS_TEMPLATE_ID, and REACT_APP_EMAILJS_PUBLIC_KEY.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    const sendViaBackupRoute = async () => {
      const endpoint =
        FORMSUBMIT_ENDPOINT ||
        `https://formsubmit.co/ajax/${encodeURIComponent(
          EMAILJS_CONFIG.receiverEmail,
        )}`;

      const backupPayload = {
        name: trimmedData.username,
        email: trimmedData.email,
        subject: trimmedData.subject,
        message: [
          `Name: ${trimmedData.username}`,
          `Phone: ${trimmedData.phoneNumber}`,
          `Email: ${trimmedData.email}`,
          "",
          trimmedData.message,
        ].join("\n"),
        _subject: `Portfolio Contact: ${trimmedData.subject}`,
        _captcha: "false",
        _template: "table",
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(backupPayload),
      });

      const payload = await response.json().catch(() => ({}));
      const success = payload?.success === true || payload?.success === "true";

      if (!response.ok || !success) {
        throw new Error(
          payload?.message ||
            `Backup delivery failed with status ${response.status}.`,
        );
      }
    };

    try {
      const templateParams = {
        name: trimmedData.username,
        from_name: trimmedData.username,
        user_name: trimmedData.username,
        from_email: trimmedData.email,
        user_email: trimmedData.email,
        email: trimmedData.email,
        phone: trimmedData.phoneNumber,
        phone_number: trimmedData.phoneNumber,
        phoneNumber: trimmedData.phoneNumber,
        subject: trimmedData.subject,
        message: trimmedData.message,
        to_email: EMAILJS_CONFIG.receiverEmail,
        to_name: "Akram Al-Mnajed",
        reply_to: trimmedData.email,
      };

      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
      );

      setFormData(initialFormData);
      setFieldErrors({});
      setStatus({
        type: "success",
        message:
          "Your message was sent successfully. Thank you, I will get back to you shortly.",
      });
    } catch (error) {
      console.error("EmailJS send failed", {
        status: error?.status,
        text: error?.text,
      });

      try {
        await sendViaBackupRoute();
        setFormData(initialFormData);
        setFieldErrors({});
        setStatus({
          type: "success",
          message:
            "Your message was sent successfully through the backup delivery route. Thank you, I will get back to you shortly.",
        });
      } catch (backupError) {
        setStatus({
          type: "error",
          message: `${resolveEmailJsErrorMessage(error)} ${resolveFormSubmitErrorMessage(
            backupError,
          )}`,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="w-full py-24 lgl:py-32 sectionDivider">
      <Title title="LET'S CONNECT" des="Contact" index={5} />
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.56, ease: [0.16, 1, 0.3, 1] }}
        className="w-full"
      >
        <div className="w-full flex flex-col lgl:flex-row justify-between gap-10 lgl:gap-16 mt-8">
          <div className="w-full lgl:w-[38%]">
            <ContactLeft />
          </div>
          <div className="w-full lgl:w-[62%]">
            {/* Calmer panel: translucent frosted surface + hairline + soft warm
                contact shadow, instead of the previous heavy gold glow. */}
            <div className="w-full flex flex-col gap-8 p-6 lgl:p-8 rounded-control border border-line bg-surface/60 backdrop-blur-md shadow-contact">
              <form
                className="w-full h-full flex flex-col gap-4 lgl:gap-6 py-2 lgl:py-5"
                onSubmit={handleSend}
                noValidate
              >
                {status.message && (
                  <p
                    className={`py-3 text-center text-sm md:text-base tracking-wide rounded-control border ${
                      status.type === "error"
                        ? "bg-red-950/25 text-red-200/90 border-red-900/30"
                        : "bg-emerald-950/25 text-emerald-200/90 border-emerald-900/30"
                    }`}
                    role="status"
                    aria-live="polite"
                  >
                    {status.message}
                  </p>
                )}
                <div className="w-full flex flex-col lgl:flex-row gap-10">
                  <div className="w-full lgl:w-1/2 flex flex-col gap-4">
                    <label
                      htmlFor="contact-name"
                      className="font-monoFont text-mono uppercase tracking-[0.16em] text-inkMuted"
                    >
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      onChange={handleInputChange("username")}
                      value={formData.username}
                      className={`contactInput ${fieldErrors.username ? "border-danger focus:border-danger focus:ring-danger/40" : ""}`}
                      name="name"
                      type="text"
                      autoComplete="name"
                      aria-invalid={fieldErrors.username ? true : undefined}
                      aria-describedby={fieldErrors.username ? "contact-name-error" : undefined}
                      disabled={isSubmitting}
                    />
                    {fieldErrors.username && (
                      <p
                        id="contact-name-error"
                        className="font-monoFont text-mono text-danger tracking-wide"
                      >
                        {fieldErrors.username}
                      </p>
                    )}
                  </div>
                  <div className="w-full lgl:w-1/2 flex flex-col gap-4">
                    <label
                      htmlFor="contact-phone"
                      className="font-monoFont text-mono uppercase tracking-[0.16em] text-inkMuted"
                    >
                      Phone Number
                    </label>
                    <input
                      id="contact-phone"
                      onChange={handleInputChange("phoneNumber")}
                      value={formData.phoneNumber}
                      className={`contactInput ${fieldErrors.phoneNumber ? "border-danger focus:border-danger focus:ring-danger/40" : ""}`}
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      aria-invalid={fieldErrors.phoneNumber ? true : undefined}
                      aria-describedby={fieldErrors.phoneNumber ? "contact-phone-error" : undefined}
                      disabled={isSubmitting}
                    />
                    {fieldErrors.phoneNumber && (
                      <p
                        id="contact-phone-error"
                        className="font-monoFont text-mono text-danger tracking-wide"
                      >
                        {fieldErrors.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <label
                    htmlFor="contact-email"
                    className="font-monoFont text-mono uppercase tracking-[0.16em] text-inkMuted"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    onChange={handleInputChange("email")}
                    value={formData.email}
                    className={`contactInput ${fieldErrors.email ? "border-danger focus:border-danger focus:ring-danger/40" : ""}`}
                    name="email"
                    type="email"
                    autoComplete="email"
                    aria-invalid={fieldErrors.email ? true : undefined}
                    aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
                    disabled={isSubmitting}
                  />
                  {fieldErrors.email && (
                    <p
                      id="contact-email-error"
                      className="font-monoFont text-mono text-danger tracking-wide"
                    >
                      {fieldErrors.email}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-4">
                  <label
                    htmlFor="contact-subject"
                    className="font-monoFont text-mono uppercase tracking-[0.16em] text-inkMuted"
                  >
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    onChange={handleInputChange("subject")}
                    value={formData.subject}
                    className={`contactInput ${fieldErrors.subject ? "border-danger focus:border-danger focus:ring-danger/40" : ""}`}
                    name="subject"
                    type="text"
                    autoComplete="off"
                    aria-invalid={fieldErrors.subject ? true : undefined}
                    aria-describedby={fieldErrors.subject ? "contact-subject-error" : undefined}
                    disabled={isSubmitting}
                  />
                  {fieldErrors.subject && (
                    <p
                      id="contact-subject-error"
                      className="font-monoFont text-mono text-danger tracking-wide"
                    >
                      {fieldErrors.subject}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-4">
                  <label
                    htmlFor="contact-message"
                    className="font-monoFont text-mono uppercase tracking-[0.16em] text-inkMuted"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    onChange={handleInputChange("message")}
                    value={formData.message}
                    className={`contactTextArea ${fieldErrors.message ? "border-danger focus:border-danger focus:ring-danger/40" : ""}`}
                    name="message"
                    cols="30"
                    rows="8"
                    aria-invalid={fieldErrors.message ? true : undefined}
                    aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
                    disabled={isSubmitting}
                  ></textarea>
                  {fieldErrors.message && (
                    <p
                      id="contact-message-error"
                      className="font-monoFont text-mono text-danger tracking-wide"
                    >
                      {fieldErrors.message}
                    </p>
                  )}
                </div>
                <div className="w-full mt-auto">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-accent text-accentText rounded-control text-sm md:text-base tracking-[0.14em] uppercase font-semibold shadow-glow hover:bg-accentDim disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-accent transition-[background-color,transform,box-shadow] duration-base ease-out active:scale-[0.97]"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;
