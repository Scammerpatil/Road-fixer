"use client";

import { IconMail, IconMapPin, IconPhone } from "@tabler/icons-react";

const Contact = () => {
  return (
    <div className="mx-auto px-10 py-12 bg-base-200">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary">Contact Us</h1>
        <p className="text-lg text-base-content/70 mt-3">
          Have questions? Reach out to us, and we'll be happy to help.
        </p>
      </div>

      <div className="grid grid-cols-6 md:grid-cols-2 gap-10">
        {/* Contact Form */}
        <div className="bg-base-300 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-secondary mb-4 text-center">
            Send Us a Message
          </h2>
          <form>
            <input
              type="text"
              placeholder="Your Name"
              className="input input-bordered w-full mb-4"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="input input-bordered w-full mb-4"
              required
            />
            <textarea
              placeholder="Your Message"
              className="textarea textarea-bordered w-full mb-4"
              rows={4}
              required
            ></textarea>
            <button className="btn btn-primary w-full">Send Message</button>
          </form>
        </div>

        <div className="w-full">
          <img
            src="/contactus.png"
            alt="Contact Us"
            className="rounded-lg mx-auto shadow-lg mb-6 h-80"
          />
          <div className="text-base-content/70">
            <p className="flex items-center gap-2 text-center">
              <IconPhone size={18} /> +91 9876543210
            </p>
            <p className="flex items-center gap-2 mt-2 text-center">
              <IconMail size={18} /> support@flatfinder.com
            </p>
            <p className="flex items-center gap-2 mt-2 text-center">
              <IconMapPin size={18} /> 123, Green Street, New Delhi, India
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
