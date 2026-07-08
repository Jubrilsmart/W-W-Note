"use server"

import { createClient } from "@/auth/server"
import prisma from "../config/prisma"
import { handleError } from "@/lib/utils"

export const loginAction = async (email: string, password: string) => {
    try {
        const { auth } = await createClient()

        const { error } = await auth.signInWithPassword({
            email,
            password
        })
        if (error) throw error;

        return { errorMessage: null }
    } catch (error) {
        return handleError(error)
    }
}

export const logOutAction = async () => {
    try {
        const { auth } = await createClient()

        const { error } = await auth.signOut()
        if (error) throw error;

        return { errorMessage: null }
    } catch (error) {
        return handleError(error)
    }
}

export const signUpAction = async (email: string, password: string) => {
    try {
        const { auth } = await createClient()

        const { data, error } = await auth.signUp({
            email,
            password
        })
        if (error) throw error;

        const userid = data.user?.id;
        if (!userid) throw new Error("Error signing up");

        const { error: signInError } = await auth.signInWithPassword({
            email,
            password
        })
        if (signInError) throw signInError;

        await prisma.user.create({
            data: {
                id: userid,
                email,
            },
        })

        return { errorMessage: null };
    } catch (error) {
        return handleError(error)
    }
}