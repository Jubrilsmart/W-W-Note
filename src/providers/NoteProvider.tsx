"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Note } from "@prisma/client";
import { getAllNotes } from "@/actions/db";
import { getUser } from "@/auth/server";

type NoteProviderContextType = {
    noteText: string;
    setNoteText: (noteText: string) => void;
    notes: Note[];
    setNotes: (notes: Note[]) => void;
}

const NoteProviderContext = createContext<NoteProviderContextType | undefined>(undefined);

export function NoteProvider({ children, initialNotes }: { children: ReactNode; initialNotes: Note[] }) {
    const [noteText, setNoteText] = useState("");
    const [notes, setNotes] = useState<Note[]>(initialNotes);

    return (
        <NoteProviderContext.Provider value={{ noteText, setNoteText, notes, setNotes }}>
            {children}
        </NoteProviderContext.Provider>)
}

export function useNote() {
    const context = useContext(NoteProviderContext);
    if (!context) {
        throw new Error("useNote must be used within a NoteProvider")
    }

    return context;
}