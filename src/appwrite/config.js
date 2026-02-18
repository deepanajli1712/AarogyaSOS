import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage, Query, Account } from "appwrite";

const MOCK_APPOINTMENTS = [
    { $id: "1", userId: "demo-user-123", hospitalId: "h1", hospitalName: "City General Hospital", dateTime: new Date(Date.now() + 86400000).toISOString(), description: "Regular checkup", status: "scheduled" },
    { $id: "2", userId: "demo-user-123", hospitalId: "h2", hospitalName: "Sunrise Medical Center", dateTime: new Date(Date.now() - 86400000).toISOString(), description: "Follow-up", status: "completed" },
];

export class Service {
    client = new Client();
    databases;
    bucket;
    account;
    isDemo = false;

    constructor() {
        try {
            if (conf.appwriteUrl && conf.appwriteProjectId && conf.appwriteProjectId !== "undefined") {
                this.client
                    .setEndpoint(conf.appwriteUrl)
                    .setProject(conf.appwriteProjectId);

                this.databases = new Databases(this.client);
                this.bucket = new Storage(this.client);
                this.account = new Account(this.client);
            } else {
                this.isDemo = true;
            }
        } catch (error) {
            this.isDemo = true;
        }
    }

    async getCurrentUser() {
        if (this.isDemo) return { $id: "demo-user-123", name: "Demo Patient" };
        try {
            const user = await this.account.get();
            return user;
        } catch (err) {
            console.error("Appwrite Service :: getCurrentUser :: error", err);
            return null;
        }
    }

    async createAppointment({ userId, hospitalId, hospitalName, dateTime, description, status }) {
        if (this.isDemo) {
            const newAppointment = {
                $id: Math.random().toString(36).substr(2, 9),
                userId, hospitalId, hospitalName, dateTime, description,
                status: status || "scheduled"
            };
            const apps = JSON.parse(localStorage.getItem("resqmed_demo_appointments") || JSON.stringify(MOCK_APPOINTMENTS));
            apps.push(newAppointment);
            localStorage.setItem("resqmed_demo_appointments", JSON.stringify(apps));
            return newAppointment;
        }
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteAppointmentCollectionId,
                ID.unique(),
                { userId, hospitalId, hospitalName, dateTime, description, status: status || "scheduled" }
            );
        } catch (err) {
            console.error("Appwrite Service :: createAppointment :: error", err.message);
            this.isDemo = true;
            return this.createAppointment({ userId, hospitalId, hospitalName, dateTime, description, status });
        }
    }

    async getAppointments(userId) {
        if (this.isDemo) {
            const apps = JSON.parse(localStorage.getItem("resqmed_demo_appointments") || JSON.stringify(MOCK_APPOINTMENTS));
            return { documents: apps.filter(a => a.userId === userId) };
        }
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteAppointmentCollectionId,
                [Query.equal("userId", userId)]
            );
        } catch (err) {
            console.error("Appwrite Service :: getAppointments :: error", err);
            this.isDemo = true;
            return this.getAppointments(userId);
        }
    }

    async deleteAppointment(appointmentId) {
        if (this.isDemo) {
            const apps = JSON.parse(localStorage.getItem("resqmed_demo_appointments") || JSON.stringify(MOCK_APPOINTMENTS));
            const newApps = apps.filter(a => a.$id !== appointmentId);
            localStorage.setItem("resqmed_demo_appointments", JSON.stringify(newApps));
            return true;
        }
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteAppointmentCollectionId,
                appointmentId
            );
            return true;
        } catch (err) {
            console.error("Appwrite Service :: deleteAppointment :: error", err);
            return false;
        }
    }

    async uploadMedicalReport(file) {
        if (this.isDemo) return { $id: "demo-file-" + Date.now() };
        try {
            return await this.bucket.createFile(
                conf.appwriteMedicalReportsBucketId,
                ID.unique(),
                file
            );
        } catch (err) {
            console.error("Appwrite Service :: uploadMedicalReport :: error", err);
            return false;
        }
    }

    getMedicalReportPreview(fileId) {
        if (this.isDemo) return "https://via.placeholder.com/150?text=Medical+Report";
        return this.bucket.getFilePreview(
            conf.appwriteMedicalReportsBucketId,
            fileId
        );
    }

    async deleteMedicalReport(fileId) {
        if (this.isDemo) return true;
        try {
            await this.bucket.deleteFile(
                conf.appwriteMedicalReportsBucketId,
                fileId
            );
            return true;
        } catch (err) {
            console.error("Appwrite Service :: deleteMedicalReport :: error", err);
            return false;
        }
    }

    async updatePatientInfo(userId, { name, age, gender, contact, address }) {
        if (this.isDemo) {
            const info = { name, age, gender, contact, address, userId };
            localStorage.setItem("resqmed_demo_patient_" + userId, JSON.stringify(info));
            return info;
        }
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwritePatientsCollectionId,
                userId,
                { name, age, gender, contact, address }
            );
        } catch (err) {
            console.error("Appwrite Service :: updatePatientInfo :: error", err);
            this.isDemo = true;
            return this.updatePatientInfo(userId, { name, age, gender, contact, address });
        }
    }

    async getPatientInfo(userId) {
        if (this.isDemo) {
            const info = localStorage.getItem("resqmed_demo_patient_" + userId);
            return info ? JSON.parse(info) : { name: "Demo Patient", age: "30", gender: "Other", contact: "1234567890", address: "123 Demo St" };
        }
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwritePatientsCollectionId,
                userId
            );
        } catch (err) {
            console.error("Appwrite Service :: getPatientInfo :: error", err);
            this.isDemo = true;
            return this.getPatientInfo(userId);
        }
    }

    async getMedicalReports(userId) {
        if (this.isDemo) return { documents: [] };
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteMedicalReportsCollectionId,
                [Query.equal("userId", userId)]
            );
        } catch (err) {
            console.error("Appwrite Service :: getMedicalReports :: error", err);
            this.isDemo = true;
            return this.getMedicalReports(userId);
        }
    }
}

const service = new Service();
export default service;
