
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";

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

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

    setSuccessMessage("");
    setErrorMessage("");

    try {
      setLoading(true);

      await axios.post(API_URL, {
        impostorDetails,
        contactInfo,
        comments,
      });

      setSuccessMessage(
        "El reporte fue enviado correctamente."
      );

      setImpostorDetails("");
      setContactInfo("");
      setComments("");

      loadReports();
    } catch (error) {
      console.error(error);

      setErrorMessage(
        "No fue posible enviar el reporte. Intente nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const recentReports = [...reports]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-36 pb-20 px-6 bg-gradient-hero">
        <div className="max-w-6xl mx-auto">
          {/* HERO */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full glass mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-5xl font-bold text-white mb-4">
              Reporte de Fraudes
            </h1>

            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Plataforma pública para reportar intentos de fraude,
              estafas y suplantación de identidad. La información
              recopilada permite apoyar las labores de monitoreo,
              análisis e investigación del Laboratorio de
              Ciberseguridad e Informática Forense.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* FORMULARIO */}
            <div className="card glass p-8 hover-lift">
              <h2 className="text-2xl font-bold mb-6">
                Registrar Reporte
              </h2>

              {successMessage && (
                <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                  <AlertTriangle className="w-5 h-5" />
                  {errorMessage}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div>
                  <label className="block mb-2 text-sm font-semibold">
                    Impostor Details
                  </label>

                  <input
                    type="text"
                    value={impostorDetails}
                    onChange={(e) =>
                      setImpostorDetails(e.target.value)
                    }
                    required
                    placeholder="Ingrese información sobre el presunto impostor"
                    className="input"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold">
                    Contact Info
                  </label>

                  <input
                    type="text"
                    value={contactInfo}
                    onChange={(e) =>
                      setContactInfo(e.target.value)
                    }
                    required
                    placeholder="Correo, teléfono u otro dato de contacto"
                    className="input"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold">
                    Comments
                  </label>

                  <textarea
                    value={comments}
                    onChange={(e) =>
                      setComments(e.target.value)
                    }
                    rows={5}
                    placeholder="Describa los hechos observados"
                    className="w-full rounded-lg border border-gray-200 bg-white/50 px-3 py-3 text-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn btn-primary btn-lg"
                >
                  {loading
                    ? "Enviando reporte..."
                    : "Enviar Reporte"}
                </button>
              </form>
            </div>

            {/* REPORTES */}
            <div className="card glass p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  Reportes Registrados
                </h2>

                <span className="badge badge-secondary">
                  Últimos 5
                </span>
              </div>

              {recentReports.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  No existen reportes registrados.
                </div>
              ) : (
                <div className="space-y-4">
                  {recentReports.map((report) => (
                    <div
                      key={report.id}
                      className="card p-5 hover-lift"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="badge badge-secondary">
                          ID #{report.id}
                        </span>

                        <span className="text-xs text-gray-500">
                          {new Date(
                            report.createdAt
                          ).toLocaleString("es-CR", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <p>
                          <strong>Impostor:</strong>{" "}
                          {report.impostorDetails}
                        </p>

                        <p>
                          <strong>Contacto:</strong>{" "}
                          {report.contactInfo}
                        </p>

                        <p>
                          <strong>Comentarios:</strong>{" "}
                          {report.comments}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UnderConstruction;