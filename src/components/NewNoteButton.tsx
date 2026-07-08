'use client';

import { User } from "@supabase/supabase-js";
import { createNoteAction, getAllNotes } from "@/actions/db";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useNote } from "@/providers/NoteProvider";

type Props = {
  user: User | null;
}

function NewNoteButton({ user }: Props) {
  const router = useRouter();
  const { notes, setNotes } = useNote();
  const [isCreating, setIsCreating] = useState(false);

  const handleNewNote = () => {
    if (!user) {
      console.error("User is not logged in.");
      return;
    }
    setIsCreating(true);
    createNoteAction(user.id)
      .then(async (result) => {
        if (result.success) {
          console.log("New note created with ID:", result.newNote?.id);
          if (result.newNote) {
            const updatedNotes = [result.newNote, ...notes];
            setNotes(updatedNotes);
            router.push(`/?noteid=${result.newNote?.id}`);
          }
        } else {
          console.error("Failed to create a new note.");
        }
        setIsCreating(false);
      })
      .catch((error) => {
        console.error("Error creating a new note:", error);
      });
  }
  return (
    <div>
      <Button
        aria-label="create new note"
        onClick={handleNewNote}
        className="flex items-center justify-center gap-2 hover:cursor-pointer hover:bg-gray-500 hover:scale-105 transition-all duration-200 ease-in-out"
        disabled={isCreating} // Prevents double-clicking while loading
      >
        {isCreating ? ( // 👈 Fixed condition logic
          <div className="flex items-center gap-2">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-white" />
            <span>Creating...</span>
          </div>
        ) : (
          "New Note"
        )}
      </Button>

    </div>
  )
}

export default NewNoteButton