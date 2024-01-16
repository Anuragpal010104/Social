import { Client, Account, Databases, Storage, Avatars } from 'appwrite';
import { Role } from 'appwrite';
export const appwriteConfig = {
    projectId: import.meta.env.VITE_APP_APPWRITE_PROJECT_ID,
    url: import.meta.env.VITE_APP_APPWRITE_URL,
    databaseId: import.meta.env.VITE_APP_APPWRITE_DATABASE_ID,
    storageId: import.meta.env.VITE_APP_APPWRITE_STORAGE_ID,
    userCollectionId: import.meta.env.VITE_APP_APPWRITE_USER_COLLECTION_ID,
    postCollectionId: import.meta.env.VITE_APP_APPWRITE_POST_COLLECTION_ID,
    savesCollectionId: import.meta.env.VITE_APP_APPWRITE_SAVES_COLLECTION_ID,
}

// export const client = new Client()
//     .setEndpoint(appwriteConfig.url);
//     .setProject(appwriteConfig.projectId);
export const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite Endpoint
    .setProject('6596673e612b0c272bfb'); // Your project ID

export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)
export const avatars = new Avatars(client)
