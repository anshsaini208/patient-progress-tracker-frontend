import { useEffect, useState } from "react";
import {
    ArrowLeft,
    User,
    Calendar,
    VenusAndMars,
    RefreshCw,
    FileText,
    Activity,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import { getPatient } from "../api/patients";

function PatientDetails() {
    const navigate = useNavigate();
    const { patientId } = useParams();

    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadPatient = async () => {
        try {
            setLoading(true);
            setError("");

            console.log(
                "Loading patient:",
                patientId
            );

            const data = await getPatient(
                patientId
            );

            console.log(
                "Patient response:",
                data
            );

            setPatient(data);

        } catch (err) {
            console.error(
                "Failed to load patient:",
                err
            );

            setError(
                err.response?.data?.detail ||
                err.message ||
                "Unable to load patient."
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (patientId) {
            loadPatient();
        }
    }, [patientId]);

    // ============================
    // LOADING
    // ============================

    if (loading) {
        return (
            <div className="patient-details-state">
                <RefreshCw
                    size={30}
                    className="spin"
                />

                <p>
                    Loading patient...
                </p>
            </div>
        );
    }

    // ============================
    // ERROR
    // ============================

    if (error) {
        return (
            <div className="patient-details-state error-state">

                <h3>
                    Unable to load patient
                </h3>

                <p>{error}</p>

                <div className="details-actions">

                    <button
                        className="secondary-btn"
                        onClick={() =>
                            navigate("/patients")
                        }
                    >
                        <ArrowLeft size={16} />
                        Back to Patients
                    </button>

                    <button
                        className="primary-btn"
                        onClick={loadPatient}
                    >
                        Try Again
                    </button>

                </div>

            </div>
        );
    }

    // ============================
    // NO PATIENT
    // ============================

    if (!patient) {
        return (
            <div className="patient-details-state">

                <h3>
                    Patient not found
                </h3>

                <button
                    className="primary-btn"
                    onClick={() =>
                        navigate("/patients")
                    }
                >
                    <ArrowLeft size={16} />
                    Back to Patients
                </button>

            </div>
        );
    }

    const patientName =
        patient.name ||
        "Unnamed Patient";

    const initials = patientName
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="patient-details-page">

            {/* ============================
          BACK
      ============================ */}

            <button
                className="back-button"
                onClick={() =>
                    navigate("/patients")
                }
            >
                <ArrowLeft size={17} />
                Back to Patients
            </button>

            {/* ============================
          PATIENT HEADER
      ============================ */}

            <div className="patient-profile-card">

                <div className="patient-profile-left">

                    <div className="large-patient-avatar">
                        {initials}
                    </div>

                    <div>

                        <p className="eyebrow">
                            PATIENT PROFILE
                        </p>

                        <h1>
                            {patientName}
                        </h1>

                        <p>
                            Patient ID: #{patient.id}
                        </p>

                    </div>

                </div>

                <button
                    className="refresh-btn"
                    onClick={loadPatient}
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>

            </div>

            {/* ============================
          BASIC INFORMATION
      ============================ */}

            <div className="patient-info-grid">

                <div className="patient-info-card">

                    <div className="info-icon">
                        <User size={18} />
                    </div>

                    <div>

                        <span>
                            Patient ID
                        </span>

                        <strong>
                            #{patient.id}
                        </strong>

                    </div>

                </div>

                <div className="patient-info-card">

                    <div className="info-icon">
                        <Calendar size={18} />
                    </div>

                    <div>

                        <span>
                            Date of Birth
                        </span>

                        <strong>
                            {patient.date_of_birth ||
                                "Not available"}
                        </strong>

                    </div>

                </div>

                <div className="patient-info-card">

                    <div className="info-icon">
                        <VenusAndMars size={18} />
                    </div>

                    <div>

                        <span>
                            Gender
                        </span>

                        <strong>
                            {patient.gender ||
                                "Not available"}
                        </strong>

                    </div>

                </div>

                <div className="patient-info-card">

                    <div className="info-icon">
                        <Activity size={18} />
                    </div>

                    <div>

                        <span>
                            Created By
                        </span>

                        <strong>
                            User #{patient.created_by}
                        </strong>

                    </div>

                </div>

            </div>

            {/* ============================
          MEDICAL RECORDS
      ============================ */}

            <div className="patient-section">

                <div className="section-heading">

                    <div>

                        <h2>
                            Medical Records
                        </h2>

                        <p>
                            Reports and health information
                            for this patient.
                        </p>

                    </div>

                    <button
                        className="primary-btn"
                        onClick={() =>
                            navigate("/documents")
                        }
                    >
                        <FileText size={17} />
                        Upload Report
                    </button>

                </div>

                <div className="empty-records">

                    <FileText size={34} />

                    <h3>
                        No reports displayed yet
                    </h3>

                    <p>
                        Upload a medical report to
                        start building this patient's
                        longitudinal record.
                    </p>

                    <button
                        className="secondary-btn"
                        onClick={() =>
                            navigate("/documents")
                        }
                    >
                        Go to Reports
                    </button>

                </div>

            </div>

            {/* ============================
          HEALTH ANALYTICS PLACEHOLDER
      ============================ */}

            <div className="patient-section">

                <div className="section-heading">

                    <div>

                        <h2>
                            Health Progress
                        </h2>

                        <p>
                            Patient metrics and trends
                            will appear here.
                        </p>

                    </div>

                </div>

                <div className="empty-records">

                    <Activity size={34} />

                    <h3>
                        Analytics coming next
                    </h3>

                    <p>
                        Once medical reports are
                        uploaded, this section will
                        display patient progress,
                        metrics and trends.
                    </p>

                </div>

            </div>

        </div>
    );
}

export default PatientDetails;