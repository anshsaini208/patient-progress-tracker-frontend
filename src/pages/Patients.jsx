import { useEffect, useState } from "react";
import {
    Search,
    UserPlus,
    RefreshCw,
    Eye,
    X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
    getPatients,
    createPatient,
} from "../api/patients";

function Patients() {
    const navigate = useNavigate();

    // ================================
    // PATIENT LIST STATE
    // ================================

    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ================================
    // ADD PATIENT MODAL STATE
    // ================================

    const [showModal, setShowModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [formError, setFormError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // ================================
    // FORM DATA
    // Matches PatientCreate schema
    // ================================

    const [formData, setFormData] = useState({
        name: "",
        date_of_birth: "",
        gender: "",
        created_by: 0,
    });

    // ================================
    // LOAD PATIENTS
    // ================================

    const loadPatients = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getPatients();

            console.log("Patients API response:", data);

            let patientList = [];

            if (Array.isArray(data)) {
                patientList = data;
            } else if (Array.isArray(data?.patients)) {
                patientList = data.patients;
            } else if (Array.isArray(data?.data)) {
                patientList = data.data;
            } else {
                console.warn(
                    "Unexpected patients response:",
                    data
                );
            }

            setPatients(patientList);
            setFilteredPatients(patientList);

        } catch (err) {
            console.error(
                "Failed to load patients:",
                err
            );

            setError(
                err.response?.data?.detail ||
                err.message ||
                "Unable to load patients."
            );

        } finally {
            setLoading(false);
        }
    };

    // ================================
    // LOAD ON PAGE OPEN
    // ================================

    useEffect(() => {
        loadPatients();
    }, []);

    // ================================
    // SEARCH PATIENTS
    // ================================

    useEffect(() => {
        const query = search
            .toLowerCase()
            .trim();

        if (!query) {
            setFilteredPatients(patients);
            return;
        }

        const filtered = patients.filter(
            (patient) =>
                JSON.stringify(patient)
                    .toLowerCase()
                    .includes(query)
        );

        setFilteredPatients(filtered);

    }, [search, patients]);

    // ================================
    // FORM INPUT CHANGE
    // ================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]:
                name === "created_by"
                    ? Number(value)
                    : value,
        }));
    };

    // ================================
    // OPEN ADD PATIENT MODAL
    // ================================

    const openAddPatientModal = () => {
        setFormError("");
        setSuccessMessage("");

        setFormData({
            name: "",
            date_of_birth: "",
            gender: "",
            created_by: 0,
        });

        setShowModal(true);
    };

    // ================================
    // CLOSE MODAL
    // ================================

    const closeModal = () => {
        if (creating) return;

        setShowModal(false);
        setFormError("");
    };

    // ================================
    // CREATE PATIENT
    // ================================

    const handleCreatePatient = async (e) => {
        e.preventDefault();

        setFormError("");
        setSuccessMessage("");

        // ----------------
        // VALIDATION
        // ----------------

        if (!formData.name.trim()) {
            setFormError(
                "Patient name is required."
            );
            return;
        }

        if (!formData.date_of_birth) {
            setFormError(
                "Date of birth is required."
            );
            return;
        }

        if (!formData.gender) {
            setFormError(
                "Please select gender."
            );
            return;
        }

        try {
            setCreating(true);

            // ----------------
            // EXACT BACKEND PAYLOAD
            // ----------------

            const payload = {
                name: formData.name.trim(),
                date_of_birth:
                    formData.date_of_birth,
                gender: formData.gender,
                created_by:
                    Number(formData.created_by),
            };

            console.log(
                "Sending patient payload:",
                payload
            );

            // ----------------
            // API REQUEST
            // ----------------

            const response =
                await createPatient(payload);

            console.log(
                "Patient created successfully:",
                response
            );

            // ----------------
            // SUCCESS
            // ----------------

            setSuccessMessage(
                "Patient created successfully!"
            );

            // Reset form

            setFormData({
                name: "",
                date_of_birth: "",
                gender: "",
                created_by: 0,
            });

            // Refresh patient list

            await loadPatients();

            // Close modal after short delay

            setTimeout(() => {
                setShowModal(false);
                setSuccessMessage("");
            }, 800);

        } catch (err) {
            console.error(
                "Create patient error:",
                err
            );

            console.error(
                "Backend response:",
                err.response?.data
            );

            const detail =
                err.response?.data?.detail;

            // FastAPI validation errors

            if (Array.isArray(detail)) {
                const messages = detail
                    .map((item) => {
                        if (typeof item === "string") {
                            return item;
                        }

                        return (
                            item.msg ||
                            JSON.stringify(item)
                        );
                    })
                    .join(", ");

                setFormError(messages);

            } else if (
                typeof detail === "string"
            ) {
                setFormError(detail);

            } else if (
                err.response?.status === 422
            ) {
                setFormError(
                    "Invalid patient data. Please check all fields."
                );

            } else if (
                err.response?.status === 500
            ) {
                setFormError(
                    "Server error while creating patient."
                );

            } else {
                setFormError(
                    err.message ||
                    "Failed to create patient."
                );
            }

        } finally {
            setCreating(false);
        }
    };

    // ================================
    // RENDER
    // ================================

    return (
        <div className="patients-page">

            {/* =================================
          PAGE HEADER
      ================================= */}

            <div className="page-heading">

                <div>
                    <p className="eyebrow">
                        PATIENT MANAGEMENT
                    </p>

                    <h1>Patients</h1>

                    <p>
                        View and manage patient records
                        and progress.
                    </p>
                </div>

                <button
                    className="primary-btn"
                    onClick={
                        openAddPatientModal
                    }
                >
                    <UserPlus size={18} />
                    Add Patient
                </button>

            </div>

            {/* =================================
          SEARCH + REFRESH
      ================================= */}

            <div className="patients-toolbar">

                <div className="patients-search">

                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search patients..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>

                <button
                    className="refresh-btn"
                    onClick={loadPatients}
                    disabled={loading}
                >

                    <RefreshCw
                        size={17}
                        className={
                            loading
                                ? "spin"
                                : ""
                        }
                    />

                    Refresh

                </button>

            </div>

            {/* =================================
          PATIENT TABLE
      ================================= */}

            <div className="patients-panel">

                {/* LOADING */}

                {loading && (

                    <div className="patients-state">

                        <RefreshCw
                            className="spin"
                            size={28}
                        />

                        <p>
                            Loading patients...
                        </p>

                    </div>

                )}

                {/* ERROR */}

                {!loading && error && (

                    <div className="patients-state error-state">

                        <h3>
                            Unable to load patients
                        </h3>

                        <p>
                            {error}
                        </p>

                        <button
                            className="primary-btn"
                            onClick={
                                loadPatients
                            }
                        >
                            Try Again
                        </button>

                    </div>

                )}

                {/* EMPTY */}

                {!loading &&
                    !error &&
                    filteredPatients.length === 0 && (

                        <div className="patients-state">

                            <h3>
                                No patients found
                            </h3>

                            <p>
                                {search
                                    ? "Try a different search."
                                    : "There are no patients in the backend yet."}
                            </p>

                        </div>

                    )}

                {/* PATIENT LIST */}

                {!loading &&
                    !error &&
                    filteredPatients.length > 0 && (

                        <>

                            <div className="patients-table-header">

                                <span>
                                    Patient
                                </span>

                                <span>
                                    Patient ID
                                </span>

                                <span>
                                    Gender
                                </span>

                                <span>
                                    Date of Birth
                                </span>

                                <span>
                                    Action
                                </span>

                            </div>

                            {filteredPatients.map(
                                (
                                    patient,
                                    index
                                ) => {

                                    const patientId =
                                        patient.id ||
                                        patient.patient_id ||
                                        patient.uuid;

                                    const name =
                                        patient.name ||
                                        patient.full_name ||
                                        `${patient.first_name || ""} ${patient.last_name || ""
                                            }`.trim() ||
                                        "Unnamed Patient";

                                    const initials =
                                        name
                                            .split(" ")
                                            .filter(Boolean)
                                            .map(
                                                (word) =>
                                                    word[0]
                                            )
                                            .join("")
                                            .slice(0, 2)
                                            .toUpperCase();

                                    return (

                                        <div
                                            className="patient-list-row"
                                            key={
                                                patientId ||
                                                index
                                            }
                                        >

                                            {/* NAME */}

                                            <div className="patient-list-name">

                                                <div className="patient-avatar">
                                                    {initials}
                                                </div>

                                                <div>

                                                    <strong>
                                                        {name}
                                                    </strong>

                                                    <span>
                                                        Patient record
                                                    </span>

                                                </div>

                                            </div>

                                            {/* ID */}

                                            <span>
                                                {patientId ||
                                                    "—"}
                                            </span>

                                            {/* GENDER */}

                                            <span>
                                                {patient.gender ||
                                                    "—"}
                                            </span>

                                            {/* DOB */}

                                            <span>
                                                {patient.date_of_birth ||
                                                    patient.dob ||
                                                    "—"}
                                            </span>

                                            {/* VIEW */}

                                            <button
                                                className="view-patient-btn"
                                                onClick={() =>
                                                    navigate(
                                                        `/patients/${patientId}`
                                                    )
                                                }
                                                disabled={
                                                    !patientId
                                                }
                                            >

                                                <Eye size={16} />

                                                View

                                            </button>

                                        </div>

                                    );
                                }
                            )}

                        </>

                    )}

            </div>

            {/* =================================
          ADD PATIENT MODAL
      ================================= */}

            {showModal && (

                <div
                    className="modal-overlay"
                    onClick={
                        closeModal
                    }
                >

                    <div
                        className="patient-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* MODAL HEADER */}

                        <div className="modal-header">

                            <div>

                                <h2>
                                    Add Patient
                                </h2>

                                <p>
                                    Create a new patient
                                    record.
                                </p>

                            </div>

                            <button
                                className="modal-close"
                                onClick={
                                    closeModal
                                }
                                disabled={
                                    creating
                                }
                            >
                                <X size={20} />
                            </button>

                        </div>

                        {/* FORM */}

                        <form
                            className="patient-form"
                            onSubmit={
                                handleCreatePatient
                            }
                        >

                            {/* NAME */}

                            <div className="form-group">

                                <label>
                                    Patient Name *
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter patient name"
                                    value={
                                        formData.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>

                            {/* DOB */}

                            <div className="form-group">

                                <label>
                                    Date of Birth *
                                </label>

                                <input
                                    type="date"
                                    name="date_of_birth"
                                    value={
                                        formData.date_of_birth
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>

                            {/* GENDER */}

                            <div className="form-group">

                                <label>
                                    Gender *
                                </label>

                                <select
                                    name="gender"
                                    value={
                                        formData.gender
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                >

                                    <option value="">
                                        Select gender
                                    </option>

                                    <option value="Male">
                                        Male
                                    </option>

                                    <option value="Female">
                                        Female
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>

                                </select>

                            </div>

                            {/* CREATED BY */}

                            <div className="form-group">

                                <label>
                                    Created By
                                </label>

                                <input
                                    type="number"
                                    name="created_by"
                                    value={
                                        formData.created_by
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                />

                                <small className="form-help">
                                    User ID responsible
                                    for creating this
                                    patient.
                                </small>

                            </div>

                            {/* ERROR */}

                            {formError && (

                                <div className="form-error">
                                    {formError}
                                </div>

                            )}

                            {/* SUCCESS */}

                            {successMessage && (

                                <div className="form-success">
                                    {successMessage}
                                </div>

                            )}

                            {/* ACTIONS */}

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={
                                        closeModal
                                    }
                                    disabled={
                                        creating
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="primary-btn"
                                    disabled={
                                        creating
                                    }
                                >

                                    {creating ? (

                                        <>
                                            <RefreshCw
                                                size={16}
                                                className="spin"
                                            />

                                            Creating...

                                        </>

                                    ) : (

                                        <>
                                            <UserPlus
                                                size={16}
                                            />

                                            Create Patient

                                        </>

                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Patients;