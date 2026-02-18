import conf from '../conf/conf.js';
import { Client, Account, ID } from "appwrite";

const DEMO_USER = {
    $id: "demo-user-123",
    name: "Demo Patient",
    email: "demo@resqmed.com",
    emailVerification: true,
    status: true,
    labels: []
};

export class AuthService {
    client = new Client();
    account;
    isDemo = false;

    constructor() {
        try {
            if (conf.appwriteUrl && conf.appwriteProjectId && conf.appwriteProjectId !== "undefined") {
                this.client
                    .setEndpoint(conf.appwriteUrl)
                    .setProject(conf.appwriteProjectId);
                this.account = new Account(this.client);
            } else {
                this.isDemo = true;
                console.log("ResQMed :: Running in Demo Mode (No Appwrite Project ID)");
            }
        } catch (error) {
            this.isDemo = true;
            console.log("ResQMed :: Running in Demo Mode (Initialization Error)");
        }
    }

    async createAccount({ email, password, name }) {
        if (this.isDemo) {
            localStorage.setItem("resqmed_demo_user", JSON.stringify({ ...DEMO_USER, email, name }));
            localStorage.setItem("resqmed_is_logged_in", "true");
            return this.getCurrentUser();
        }
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                return this.login({ email, password });
            } else {
                return userAccount;
            }
        } catch (error) {
            if (error.code === 401 || error.message.includes("Project not found")) {
                this.isDemo = true;
                return this.createAccount({ email, password, name });
            }
            throw error;
        }
    }

    async login({ email, password }) {
        if (this.isDemo) {
            localStorage.setItem("resqmed_is_logged_in", "true");
            return true;
        }
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            if (error.message.includes("Project not found")) {
                this.isDemo = true;
                return this.login({ email, password });
            }
            throw error;
        }
    }

    async getCurrentUser() {
        if (this.isDemo) {
            const user = localStorage.getItem("resqmed_demo_user");
            const isLoggedIn = localStorage.getItem("resqmed_is_logged_in");
            if (isLoggedIn === "true") {
                return user ? JSON.parse(user) : DEMO_USER;
            }
            return null;
        }
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite serive :: getCurrentUser :: error", error);
            if (error.message.includes("Project not found")) {
                this.isDemo = true;
                return this.getCurrentUser();
            }
        }

        return null;
    }

    async logout() {
        if (this.isDemo) {
            localStorage.removeItem("resqmed_is_logged_in");
            return;
        }
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite serive :: logout :: error", error);
        }
    }
}

const authService = new AuthService();

export default authService


