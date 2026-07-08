"use server";

import prisma from "@/config/prisma";

export async function updateNoteAction(noteId: string, text: string) {
  try {
    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: { text: text },
    });

    return { success: true, updatedAt: updatedNote.updatedAt };
  } catch (error) {
    console.error("Autosave failed:", error);
    return { success: false };
  }
}

export async function createNoteAction(authorId: string) {
  try {
    const newNote = await prisma.note.create({
      data: {
        authorId: authorId,
        text: "",
      },
    });

    return { success: true, newNote };
  } catch (error) {
    console.error("Failed to create a new note:", error);
    return { success: false };
  }
}

export async function deleteNoteAction(noteId: string) {
  try {
    await prisma.note.delete({
      where: { id: noteId },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to delete the note:", error);
    return { success: false };
  }
}

export async function getAllNotes(authorId: string) {
  try {
    const notes = await prisma.note.findMany({
      where: { authorId: authorId },
      orderBy: { updatedAt: "desc" },
    });

    return notes;
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    return [];
  }
}