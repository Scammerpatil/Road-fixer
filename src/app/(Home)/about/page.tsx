"use client";

const About = () => {
  return (
    <div className="px-6 py-12 bg-base-100">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary">
          About TributeConnect
        </h1>
        <p className="text-lg text-base-content/70 mt-3">
          Honoring legacies, cherishing memories, and supporting causes that
          matter.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image Section */}
        <img
          src="/tribute.png"
          alt="About TributeConnect"
          className="rounded-lg shadow-lg h-96 object-cover mx-auto"
        />

        {/* Text Section */}
        <div>
          <h2 className="text-2xl font-semibold text-secondary">Our Mission</h2>
          <p className="text-base-content/70 mt-3">
            TributeConnect is a platform dedicated to celebrating the lives of
            loved ones while enabling financial contributions to honor their
            memory. We provide a meaningful space where families and friends can
            create heartfelt tributes, share stories, and support causes that
            their loved ones cared about.
          </p>

          <h2 className="text-2xl font-semibold text-secondary mt-6">
            Why Choose TributeConnect?
          </h2>
          <ul className="list-disc list-inside text-base-content/70 mt-3 space-y-2">
            <li>
              Create personalized tributes with images and heartfelt messages.
            </li>
            <li>
              Secure and easy-to-use donation system to support meaningful
              causes.
            </li>
            <li>Engage with a supportive community that values remembrance.</li>
            <li>
              Preserve legacies through stories, photos, and shared memories.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
