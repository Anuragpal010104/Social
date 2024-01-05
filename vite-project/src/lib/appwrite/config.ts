import { Client, Account, Databases, Storage, Avatars } from 'appwrite';

export const appwriteConfig = {
    projectId: import.meta.env.VITE_APP_APPWRITE_PROJECT_ID,
    url: import.meta.env.VITE_APP_APPWRITE_URL,
}

export const client = new Client()

client
    .setProject(appwriteConfig.projectId)
    .setEndpoint(appwriteConfig.url)

export const account = new Account(client)
export const database = new Databases(client)
export const storage = new Storage(client)
export const avatars = new Avatars(client)