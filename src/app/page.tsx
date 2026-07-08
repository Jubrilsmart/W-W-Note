export const dynamic = 'force-dynamic';

import { getUser } from "@/auth/server"
import NewNoteButton from "@/components/NewNoteButton";
import NoteTextInput from "@/components/NoteTextInput";
import prisma from "../config/prisma";
import React from "react";
import AIChatModal from "@/components/AICard";


type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function HomePage({ searchParams }: Props) {
    const noteIdParam = (await searchParams).noteid;
    const user = await getUser();

    const noteId = Array.isArray(noteIdParam)
        ? noteIdParam![0]
        : noteIdParam || "";

    const note = await prisma.note.findUnique({
        where: { id: noteId, authorId: user?.id },
    });

    return (
        <div className="flex h-full flex-col items-center gap-4">
            <div className="flex w-full wax-w-4xl justify-end gap-2">
                <AIChatModal user={user} />
                <NewNoteButton user={user} />
            </div>

            <NoteTextInput noteId={noteId} startingNoteText={note?.text || ""} />
        </div>
    )
}

export default HomePage