"use client"

import { User } from "@supabase/supabase-js";
import { useSearchParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea"
import { ChangeEvent, useEffect } from "react";
import { debounceTimeout } from "@/app/constants";
import { useNote } from "@/providers/NoteProvider";
import { updateNoteAction } from "@/actions/db";

type Props = {
    noteId: string;
    startingNoteText: string;
}

let updateTimeout: NodeJS.Timeout;

function NoteTextInput({ noteId, startingNoteText }: Props) {
    const noteIdParam = useSearchParams().get("noteId");
    const { noteText, setNoteText } = useNote();

    useEffect(() => {
        setNoteText(startingNoteText)
    }, [, noteIdParam, noteId, setNoteText, startingNoteText]);

    const handleUpdateNote = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;

        setNoteText(text)

        clearTimeout(updateTimeout);
        updateTimeout = setTimeout(() => {
            updateNoteAction(noteId, text);
        }, debounceTimeout)


    };

    return (
        <Textarea
            value={noteText}
            onChange={handleUpdateNote}
            placeholder="Type your notes here..."
            className="custom-scrollbar placeholder:text-muted-foreground
    wb-4 h-full max-w-4xl resize-none border p-4 focus-visible:ring-0
    focus-visible:ring-offset-0"
        />
    )
}

export default NoteTextInput