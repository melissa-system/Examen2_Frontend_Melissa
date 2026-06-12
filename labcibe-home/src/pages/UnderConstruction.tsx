import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

interface Fraud {
  id: number;
  impostorDetails: string;
  contactInfo: string;
  comments: string;
  createdAt: string;
}

const API_URL = "http://myexam.tryasp.net/api/Fraud";

const UnderConstruction = () => {
  const [impostorDetails, setImpostorDetails] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [comments, setComments] = useState("");
  const [reports, setReports] = useState<Fraud[]>([]);
  const [loading, setLoading] = useState(false);

  const loadReports = async () => {
    try {
      const response = await axios.get(API_URL);
      setReports(response.data);
    } catch (error) {
      console.error("Error loading reports", error);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(API_URL, {
        impostorDetails,
        contactInfo,
        comments,
      });

      alert("Fraud report submitted successfully.");

      setImpostorDetails("");
      setContactInfo("");
      setComments("");

      loadReports();
    } catch (error) {
      console.error(error);
      alert("Error submitting report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 mt-24 px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            Fraud Reporting Platform
          </h1>

          <p className="mb-8 text-gray-600">
            Report suspected fraud attempts and review submitted reports.
          </p>

          <div className="bg-white rounded-xl shadow p-6 mb-10">
            <h2 className="text-2xl font-semibold mb-4">
              Submit Fraud Report
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">
                  Impostor Details
                </label>
                <input
                  type="text"
                  value={impostorDetails}
                  onChange={(e) => setImpostorDetails(e.target.value)}
                  required
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Contact Info
                </label>
                <input
                  type="text"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  required
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Comments
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={4}
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-lg bg-black text-white"
              >
                {loading ? "Submitting..." : "Submit Report"}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Submitted Reports
            </h2>

            {reports.length === 0 ? (
              <p>No reports found.</p>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="border rounded-lg p-4"
                  >
                    <p>
                      <strong>ID:</strong> {report.id}
                    </p>

                    <p>
                      <strong>Impostor:</strong>{" "}
                      {report.impostorDetails}
                    </p>

                    <p>
                      <strong>Contact:</strong>{" "}
                      {report.contactInfo}
                    </p>

                    <p>
                      <strong>Comments:</strong>{" "}
                      {report.comments}
                    </p>

                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(report.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8">
            <Link
              to="/"
              className="text-blue-600 underline"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UnderConstruction;