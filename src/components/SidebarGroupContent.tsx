"use client"

// 💡 FIX: Import Note type from your actual local generated directory path
import { Note } from "@prisma/client";
import { useNote } from "@/providers/NoteProvider";
import { useSearchParams } from "next/navigation"; // Cleaned up the sub-path import structure
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { deleteNoteAction } from "@/actions/db";
import { useRouter } from "next/navigation";

type Props = {
    notes: Note[]
};

function SidebarGroupContent() {
    // 💡 FIX: Aligned this to look for lowercase "noteid" to match your link href below
    const noteIdParam = useSearchParams().get("noteid");
    const router = useRouter();
    const { noteText, notes, setNotes } = useNote();
    const [filteredNotes, setFilteredNotes] = useState<Note[]>(notes);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        setFilteredNotes(notes);
    }, [notes]);

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const filtered = notes.filter((note) =>
            note.text.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredNotes(filtered);
    };

    const handleDeleteNote = async (noteId: string) => {
        setDeleting(true);
        const deleted = await deleteNoteAction(noteId);
        if (deleted) {
            const updatedNotes = notes.filter((note) => note.id !== noteId);
            setNotes(updatedNotes);
            setFilteredNotes(updatedNotes);
            router.push("/"); // Refresh the page to reflect the deletion
            console.log(`Delete note with ID: ${noteId}`);
        }
        setDeleting(false);
    };

    return (
        <div className="relative">
            <div className='mx-1 my-4 flex justify-center'>
                <input type="text" placeholder='🔎 Search your notes' onChange={handleFilterChange}
                    className='rounded bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500 dark:text-gray-300 w-full px-2 py-1 text-sm' />
            </div>
            {deleting && (
                <div className="absolute inset-0 bg-gray-500/40 z-50 flex items-center justify-center">
                    <div>
                        <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-gray-400 border-t-white" />
                        <span className="ml-2 text-xl font-medium text-gray-700 dark:text-white">Deleting...</span>
                    </div>
                </div>
            )}
            {filteredNotes.map((note) => (
                <div key={note.id} className={`group mb-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 ${note.id === noteIdParam ? "bg-gray-300 dark:bg-gray-600 font-medium" : ""} relative`}>
                    <a
                        href={`/?noteid=${note.id}`}
                        className={`block rounded-md px-2 pb-2 text-sm`}
                    >
                        {/* 💡 If this note is the active one, show the live context state! */}
                        {note.id === noteIdParam
                            ? (noteText.substring(0, 30) || "Empty Note")
                            : (note.text.substring(0, 30) || "Empty Note")
                        }
                    </a>
                    <div className="px-2 text-xs text-gray-500 dark:text-gray-400">
                        {note.updatedAt.toLocaleString().substring(0, 10)} {/* Display only the date part */}
                    </div>

                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 md:opacity-0 md:[div:hover>&]:opacity-100 transition-opacity duration-200"
                        onClick={() => handleDeleteNote(note.id)}>
                        <Trash2 className="text-red-600 h-3 w-3 hover:text-red-800 hover:cursor-pointer hover:scale-150 transition-transform duration-200" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default SidebarGroupContent;
