import { useEffect, useState } from "react";
import {
    Upload,
    FileText,
    RefreshCw,
    CheckCircle,
    AlertCircle,
    X,
} from "lucide-react";

import {
    getPatients,
    uploadPatientDocument,
} from "../api/patients";

function Documents() {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] =
        useState("");

    const [selectedFile, setSelectedFile] =
        useState(null);

    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getPatients();

            const patientList = Array.isArray(data)
                ? data
                : data?.patients || data?.data || [];

            setPatients(patientList);
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.detail ||
                err.message ||
                "Unable to load patients."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];

        setMessage("");
        setError("");

        if (file) {
            setSelectedFile(file);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);

        const input =
            document.getElementById("report-file");

        if (input) {
            input.value = "";
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!selectedPatient) {
            setError("Please select a patient.");
            return;
        }

        if (!selectedFile) {
            setError("Please select a report file.");
            return;
        }

        try {
            setUploading(true);

            console.log("Uploading:", {
                patientId: selectedPatient,
                file: selectedFile.name,
            });

            const result =
                await uploadPatientDocument(
                    selectedPatient,
                    selectedFile
                );

            console.log(
                "Upload successful:",
                result
            );

            setMessage(
                "Report uploaded successfully!"
            );

            setSelectedFile(null);

            const input =
                document.getElementById(
                    "report-file"
                );

            if (input) {
                input.value = "";
            }

        } catch (err) {
            console.error(
                "Upload error:",
                err
            );

            console.error(
                "Backend response:",
                err.response?.data
            );

            const detail =
                err.response?.data?.detail;

            if (Array.isArray(detail)) {
                setError(
                    detail
                        .map(
                            (item) =>
                                item.msg ||
                                JSON.stringify(item)
                        )
                        .join(", ")
                );
            } else {
                setError(
                    detail ||
                    err.message ||
                    "Failed to upload report."
                );
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="documents-page">

            <div className="page-heading">

                <div>
                    <p className="eyebrow">
                        MEDICAL DOCUMENTS
                    </p>

                    <h1>Reports</h1>

                    <p>
                        Upload medical reports for
                        your patients.
                    </p>
                </div>

            </div>

            <div className="upload-card">

                <div className="upload-card-header">

                    <div className="upload-icon">
                        <FileText size={24} />
                    </div>

                    <div>
                        <h2>
                            Upload Medical Report
                        </h2>

                        <p>
                            Select a patient and upload
                            their medical report.
                        </p>
                    </div>

                </div>

                <form
                    className="upload-form"
                    onSubmit={handleUpload}
                >

                    {/* PATIENT */}

                    <div className="form-group">

                        <label>
                            Select Patient *
                        </label>

                        <select
                            value={selectedPatient}
                            onChange={(e) =>
                                setSelectedPatient(
                                    e.target.value
                                )
                            }
                            disabled={
                                loading || uploading
                            }
                        >

                            <option value="">
                                {loading
                                    ? "Loading patients..."
                                    : "Select a patient"}
                            </option>

                            {patients.map(
                                (patient) => (
                                    <option
                                        key={patient.id}
                                        value={patient.id}
                                    >
                                        {patient.name}
                                        {" — ID "}
                                        {patient.id}
                                    </option>
                                )
                            )}

                        </select>

                    </div>

                    {/* FILE */}

                    <div className="form-group">

                        <label>
                            Medical Report *
                        </label>

                        <label
                            htmlFor="report-file"
                            className="file-upload-box"
                        >

                            <Upload size={28} />

                            <strong>
                                Click to select report
                            </strong>

                            <span>
                                PDF, DOC, DOCX, JPG or PNG
                            </span>

                        </label>

                        <input
                            id="report-file"
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            disabled={uploading}
                            hidden
                        />

                    </div>

                    {/* SELECTED FILE */}

                    {selectedFile && (

                        <div className="selected-file">

                            <div className="selected-file-left">

                                <FileText size={20} />

                                <div>

                                    <strong>
                                        {selectedFile.name}
                                    </strong>

                                    <span>
                                        {(
                                            selectedFile.size /
                                            1024 /
                                            1024
                                        ).toFixed(2)}{" "}
                                        MB
                                    </span>

                                </div>

                            </div>

                            <button
                                type="button"
                                className="remove-file"
                                onClick={removeFile}
                            >
                                <X size={17} />
                            </button>

                        </div>

                    )}

                    {/* SUCCESS */}

                    {message && (

                        <div className="upload-success">

                            <CheckCircle size={18} />

                            <span>
                                {message}
                            </span>

                        </div>

                    )}

                    {/* ERROR */}

                    {error && (

                        <div className="upload-error">

                            <AlertCircle size={18} />

                            <span>
                                {error}
                            </span>

                        </div>

                    )}

                    {/* BUTTON */}

                    <button
                        type="submit"
                        className="primary-btn upload-button"
                        disabled={
                            uploading || loading
                        }
                    >

                        {uploading ? (

                            <>
                                <RefreshCw
                                    size={17}
                                    className="spin"
                                />

                                Uploading...

                            </>

                        ) : (

                            <>
                                <Upload size={17} />

                                Upload Report
                            </>

                        )}

                    </button>

                </form>

            </div>

        </div>
    );
}

export default Documents;