import { db } from "@/firebaseConfig";
import { CommentData, CommentObject } from "@/utils/postData";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

export const addComment = async (postId: string, comment: CommentData) => {
  try {
    const commentRef = await addDoc(collection(db, "comments"), comment);
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      comments: arrayUnion(commentRef.id),
    });
    console.log("Added comment with id", commentRef.id);
    return commentRef.id;
  } catch (error) {
    console.log("Error adding comment", error);
  }
};

export const getCommentsByIds = async (ids: string[]) => {
  try {
    const response = await Promise.all(
      ids.map((id) => {
        return getDoc(doc(db, "comments", id));
      })
    );
    return response.map((doc) => {
      return { id: doc.id, comment: doc.data() } as CommentObject;
    });
  } catch (error) {
    console.log("Error getting comments", error);
  }
};