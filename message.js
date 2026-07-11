import { db } from "../firebase";

import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot,
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove
} from "firebase/firestore";

export async function sendMessage(
    roomCode,
    text,
    sender,
    image = null
) {

    if (!text.trim() && !image) return;

    await addDoc(
        collection(db, "rooms", roomCode, "messages"),
        {
            text,
            sender,
            image,
            reactions: [],
            createdAt: serverTimestamp()
        }
    );

}

export async function toggleHeartReaction(

    roomCode,
    messageId,
    username,
    reacted

) {

    const messageRef = doc(

        db,

        "rooms",
        roomCode,
        "messages",
        messageId

    );

    if (reacted) {

        await updateDoc(messageRef, {

            reactions: arrayRemove(username)

        });

    }

    else {

        await updateDoc(messageRef, {

            reactions: arrayUnion(username)

        });

    }

}

export function listenMessages(roomCode, callback) {

    const q = query(

        collection(
            db,
            "rooms",
            roomCode,
            "messages"
        ),

        orderBy("createdAt")

    );

    onSnapshot(q, (snapshot) => {

        const messages = [];

        snapshot.forEach((docSnap) => {

            messages.push({

                id: docSnap.id,

                ...docSnap.data()

            });

        });

        callback(messages);

    });

}