import { INewPost, INewUser } from "@/types";
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

//creat post
// export async function createPost(post: INewPost){
//     try {
//         //upload image to storage
//         const uploadedFile = await uploadFile(post.file[0]);
        
//         if(!uploadedFile){
//             throw Error;
//         }

//         //get the url
//         const fileUrl = getFilePreview(uploadedFile.$id);
//         console.log(fileUrl)

//         if(!fileUrl){
//             deleteFile(uploadedFile.$id);
//             throw Error;
//         }

//         //convert tags in an array
//         const tags = post.tags?.replace(/ /g,'').split(',') || [];

//         //save post to database

//         const newPost = await databases.createDocument(
//             appwriteConfig.databaseId,
//             appwriteConfig.postCollectionId,
//             ID.unique(),
//             {
//                 creator: post.userId,
//                 cpation: post.caption,
//                 imageUrl: fileUrl,
//                 imageId: uploadedFile.$id,
//                 location: post.location,
//                 tags: tags,
//             }
//         )

//         if(!newPost){
//            await deleteFile(uploadedFile.$id);
//             throw Error;
//         }

//         return newPost;

//     } catch (error) {
//         console.log(error)
//     }
// }

export async function createPost(post: INewPost) {
    try {
      // Upload file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
  
      if (!uploadedFile) throw Error;
  
      // Get file url
      const fileUrl = await getFilePreview(uploadedFile.$id);
      console.log("hello")
      console.log(fileUrl);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
  
      // Convert tags into array
      const tags = post.tags?.replace(/ /g, "").split(",") || [];
  
      // Create post
      const newPost = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        ID.unique(),
        {
          creator: post.userId,
          Caption: post.caption,
          ImageUrl: fileUrl,
          ImageId: uploadedFile.$id,
          location: post.location,
          tags: tags,
        }
      );
  
      console.log(newPost);
  
      if (!newPost) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
  
      return newPost;
    } catch (error) {
      console.log(error);
    }
  }

//upload file
export async function uploadFile(file: File){
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        );

        return uploadedFile;

    } catch (error) {
        console.log(error)
    }
}

//get file url
export async function getFilePreview(fileId: string){
    try {
        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000,
            2000,
            "top",
            100,
        )
        if(!fileUrl) throw Error;

        console.log(fileUrl)
        return fileUrl;

        
    } catch (error) {
        console.log(error)
    }
}

export async function deleteFile(fileId:string){
    try {
        await storage.deleteFile(appwriteConfig.storageId, fileId);

        return { status: 'ok'}

    } catch (error) {
        console.log(error)
    }
}

export async function getRecentPosts(){
    try {
        const posts = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.postCollectionId,
          [Query.orderDesc("$createdAt"), Query.limit(20)]
        );
    
        if (!posts) throw Error;
    
        return posts;
      } catch (error) {
        console.log(error);
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