import api from "./client";

export const getPatients = async () => {
    const response = await api.get("/patients");
    return response.data;
};

export const getPatient = async (patientId) => {
    const response = await api.get(
        `/patients/${patientId}`
    );

    return response.data;
};

export const createPatient = async (
    patientData
) => {
    const response = await api.post(
        "/patients",
        patientData
    );

    return response.data;
};

export const deletePatient = async (
    patientId
) => {
    const response = await api.delete(
        `/patients/${patientId}`
    );

    return response.data;
};

export const getPatientMetrics = async (
    patientId
) => {
    const response = await api.get(
        `/patients/${patientId}/metrics`
    );

    return response.data;
};

export const getPatientTimeline = async (
    patientId
) => {
    const response = await api.get(
        `/patients/${patientId}/timeline`
    );

    return response.data;
};

export const getPatientTrends = async (
    patientId,
    testName
) => {
    const response = await api.get(
        `/patients/${patientId}/trends/${encodeURIComponent(
            testName
        )}`
    );

    return response.data;
};

export const comparePatientReports = async (
    patientId
) => {
    const response = await api.get(
        `/patients/${patientId}/compare`
    );

    return response.data;
};

export const askPatientAI = async (
    patientId,
    question
) => {
    const response = await api.post(
        `/patients/${patientId}/ask`,
        {
            question,
        }
    );

    return response.data;
};

export const uploadPatientDocument = async (
    patientId,
    file
) => {
    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post(
        `/patients/${patientId}/documents`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};