import { INewUser } from "@/types";
import { ID,Permission,Query,Role } from 'appwrite'
import { account, appwriteConfig, avatars, client, databases,storage } from "./config";

//sign up
export async function createUserAccount(user: INewUser) {
    try{
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        )
        if(!newAccount) throw Error;
        
        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl,

        })

        return newUser;
    } catch (error) {
        console.error(error);
        return error;
    }
}

//save user to database
export async function saveUserToDB(user: {
    accountId: string;
    email: string;
    name: string;
    imageUrl: URL;
    username?: string;
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user,
            [
            Permission.read(Role.any()),            
            Permission.update(Role.any()),      
            Permission.update(Role.any()),        
            Permission.delete(Role.any()),          
            ]
        );

        return newUser;
    } catch (error) {
        console.error(error);
    }
}


//sign in
export async function signInAccount(user: {email: string;
    password: string;
}) {
    try {
        const session = await account.createEmailSession(user.email, user.password);
        return session;
    } catch (error) {
        console.error(error);
    }
}

//get account
export async function getAccount() {
    Role.any();
    try {
        const currentAccount = await account.get();
    
        return currentAccount;
    } catch (error) {
        console.log(error);
    }
}

//get user
export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
            
        );

        if(!currentUser) throw Error;

        return currentUser.documents[0];

    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function signOutAccount() {
    try {
        const session = await account.deleteSession("current");
        return session;
    } catch (error) {
        console.error(error);
    }

}

// export function getCurrentUser(){
//     let promise = databases.listDocuments(
//         "6597ad3edba3cddb7db6",
//         "6597ade575e95bda46d4",
       
//     );
    
//     promise.then(function (response) {
//         console.log(response);
//     }, function (error) {
//         console.log(error);
//     });
// }