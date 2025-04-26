"use client";

import { Tribute } from "@/types/Tribute";
import {
  IconHeart,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

const Tributes = () => {
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tributesPerPage = 8;

  const fetchTributes = async () => {
    try {
      const res = await axios.get("/api/tributes");
      setTributes(res.data.tributes);
    } catch (error) {
      console.error("Failed to fetch tributes:", error);
    }
  };

  useEffect(() => {
    fetchTributes();
  }, []);

  // Pagination Logic
  const indexOfLastTribute = currentPage * tributesPerPage;
  const indexOfFirstTribute = indexOfLastTribute - tributesPerPage;
  const currentTributes = tributes.slice(
    indexOfFirstTribute,
    indexOfLastTribute
  );

  const totalPages = Math.ceil(tributes.length / tributesPerPage);

  return (
    <section className="bg-base-300 min-h-[calc(100vh-6rem)] py-10 px-10">
      <div className="container mx-auto">
        {tributes.length === 0 && (
          <p className="text-center text-error text-lg">
            No tributes available yet.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentTributes.map((tribute) => (
            <Link
              key={tribute._id}
              href={`/tribute/${tribute._id}`}
              className="bg-base-100 shadow-lg rounded-xl overflow-hidden border border-primary"
            >
              {/* Tribute Image */}
              <div className="h-52 w-full overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={tribute.image || "/avatar.png"}
                  alt={tribute.name}
                />
              </div>

              {/* Tribute Content */}
              <div className="p-5 flex flex-col justify-between">
                <h2 className="mb-2 text-xl font-semibold text-center text-secondary">
                  {tribute.name}
                </h2>
                <p className="mb-3 text-sm text-center text-base-content/70">
                  {tribute.description}
                </p>

                {/* Birth & Death Dates */}
                <div className="mt-4 flex justify-between items-center text-sm text-base-content/80 bg-base-200 p-3 rounded-lg">
                  <div className="flex flex-col items-center">
                    <span className="font-semibold text-primary">Born</span>
                    <span>{new Date(tribute.dob).toDateString()}</span>
                  </div>
                  <div className="text-lg font-bold text-error">✝</div>
                  <div className="flex flex-col items-center">
                    <span className="font-semibold text-primary">Passed</span>
                    <span>{new Date(tribute.dod).toDateString()}</span>
                  </div>
                </div>

                <div className="divider"></div>

                {/* Like & Give Fund Buttons */}
                <div className="flex justify-between items-center">
                  <Link
                    className="btn btn-error btn-outline flex items-center gap-2"
                    href="/login"
                  >
                    <IconHeart /> Like
                  </Link>
                  <Link className="btn btn-success btn-outline" href="/login">
                    Give Fund
                  </Link>
                </div>

                <div className="divider"></div>

                {/* Tribute Owner */}
                <div className="flex items-center space-x-3">
                  <div className="avatar">
                    <div className="w-12 rounded-full">
                      <img
                        src={
                          tribute.user.profileImage || "/user-placeholder.png"
                        }
                        alt={tribute.user.name}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-base-content">
                      {tribute.user.name}
                    </p>
                    <p className="text-xs text-base-content">
                      {tribute.user.email}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="join grid grid-cols-2 mt-8">
            <button
              className={`join-item btn btn-outline ${
                currentPage === 1 ? "btn-disabled" : ""
              }`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              <IconChevronLeft /> Prev
            </button>
            <span className="mx-4 text-lg font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className={`join-item btn btn-outline ${
                currentPage === totalPages ? "btn-disabled" : ""
              }`}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            >
              Next <IconChevronRight />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Tributes;
