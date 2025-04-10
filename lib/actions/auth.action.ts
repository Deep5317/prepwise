"use server";

import { auth, db } from "@/firebase/admin";
import { error } from "console";
import { cookies } from "next/headers";

const ONE_WEEK = 60*60*24*7

export async function signUp(params:SignUpParams){
    const {uid,name,email} = params;
    try {
        const userRecord = await db.collection('users').doc(uid).get();
        if(userRecord.exists){
            return {
                success:false,
                message:"user already exist. Please sigin in insted.",
            }
        }
        await db.collection('users').doc(uid).set({
            name,email
        });

        return {
            success: true,
            message: "Account creaed succesfully. Please sign in",
        }

    } catch (e:any) {
        console.error("Error creating user:", error);

        // Handle Firebase specific errors
        if (e.code === "auth/email-already-exists") {
          return {
            success: false,
            message: "This email is already in use",
          };
        }
        return {
            success: false,
            message: "Failed to create account. Please try again.",
        };
    }
}

export async function signIn(params:SignInParams) {
    const {email,idToken} = params;
    try {
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord)
        return {
            success: false,
            message: "User does not exist. Create an account.",
        };

        await setSessionCookie(idToken);
        
    } catch (error:any) {
        console.log("");

        return {
            success: false,
            message: "Failed to log into account. Please try again.",
        };
    }
}

export async function setSessionCookie(idToken:string) {
    const cookiestore = await cookies();
    const sessionCookie = await auth.createSessionCookie(idToken,{
        expiresIn: ONE_WEEK*1000
    })

    cookiestore.set('Session',sessionCookie,{
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path:'/',
        sameSite: 'lax',
    })
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
  
    const sessionCookie = cookieStore.get("session")?.value;
    if (!sessionCookie) return null;
  
    try {
      const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
  
      // get user info from db
      const userRecord = await db
        .collection("users")
        .doc(decodedClaims.uid)
        .get();
      if (!userRecord.exists) return null;
  
      return {
        ...userRecord.data(),
        id: userRecord.id,
      } as User;
    } catch (error) {
      console.log(error);
  
      // Invalid or expired session
      return null;
    }
  }

  
export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}