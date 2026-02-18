const conf = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
    appwriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    appwriteAppointmentCollectionId: String(import.meta.env.VITE_APPWRITE_APPOINTMENTS_COLLECTION_ID),
    appwritePatientsCollectionId: String(import.meta.env.VITE_APPWRITE_PATIENTS_COLLECTION_ID),
    appwriteMedicalReportsCollectionId: String(import.meta.env.VITE_APPWRITE_MEDICAL_REPORTS_COLLECTION_ID),
    appwriteMedicalReportsBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
}

export default conf     