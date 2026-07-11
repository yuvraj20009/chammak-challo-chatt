import { uploadImage } from "./uploadImage";
import { sendMessage, listenMessages } from "./message";

import {
    joinPresence,
    leavePresence,
    listenPresence
} from "./presense";

import {
    startTyping,
    stopTyping,
    listenTyping
} from "./typing";

import { renderMessages } from "../ui/renderMessages";
import { renderOnline } from "../ui/renderOnline";
import { renderTyping } from "../ui/renderTyping";
import { enableImageViewer } from "./imageViewer";

export function startChat(roomCode) {

    const myName =
        localStorage.getItem("username");

    const messageInput =
        document.getElementById("messageInput");

    const sendBtn =
        document.getElementById("sendBtn");

    const imageBtn =
        document.getElementById("imageBtn");

    const imageInput =
        document.getElementById("imageInput");

    const copyBtn =
        document.getElementById("copyBtn");

    const leaveBtn =
        document.getElementById("leaveBtn");

    const messagesDiv =
        document.querySelector(".messages");

    const onlineDiv =
        document.getElementById("onlineCount");

    const typingDiv =
        document.getElementById("typingIndicator");

    messageInput.focus();

    enableImageViewer();

    joinPresence(
        roomCode,
        myName
    );

    listenPresence(roomCode, (users) => {

        renderOnline(
            users,
            onlineDiv
        );

    });

    let typingTimeout;

    messageInput.addEventListener("input", () => {

        startTyping(
            roomCode,
            myName
        );

        clearTimeout(
            typingTimeout
        );

        typingTimeout = setTimeout(() => {

            stopTyping(
                roomCode,
                myName
            );

        }, 1000);

    });

    listenTyping(roomCode, (users) => {

        renderTyping(

            users,

            myName,

            typingDiv

        );

    });

    copyBtn.addEventListener("click", async () => {

        await navigator.clipboard.writeText(
            roomCode
        );

        copyBtn.innerHTML = "✅";

        setTimeout(() => {

            copyBtn.innerHTML = "📋";

        }, 1500);

    });

    leaveBtn.addEventListener("click", () => {

        leavePresence(
            roomCode,
            myName
        );

        stopTyping(
            roomCode,
            myName
        );

        location.reload();

    });    /* ---------------- SEND MESSAGE ---------------- */

    async function send() {

        const text = messageInput.value.trim();

        if (!text) return;

        await sendMessage(

            roomCode,

            text,

            myName

        );

        stopTyping(
            roomCode,
            myName
        );

        messageInput.value = "";

        messageInput.focus();

    }

    sendBtn.addEventListener(
        "click",
        send
    );

    messageInput.addEventListener(
        "keydown",
        (e) => {

            if (e.key === "Enter") {

                send();

            }

        }

    );

    /* ---------------- IMAGE UPLOAD ---------------- */

    imageBtn.addEventListener("click", () => {

        imageInput.click();

    });

    imageInput.addEventListener("change", async () => {

        const file = imageInput.files[0];

        if (!file) return;

        imageBtn.innerHTML = "⏳";

        try {

            const imageUrl =
                await uploadImage(file);

            await sendMessage(

                roomCode,

                "",

                myName,

                imageUrl

            );

        }

        catch (err) {

            console.error(err);

            alert("Image upload failed.");

        }

        imageBtn.innerHTML = "📷";

        imageInput.value = "";

    });

    /* ---------------- LISTEN ---------------- */

    listenMessages(roomCode, (messages) => {

        messagesDiv.innerHTML =

            renderMessages(

                messages,

                myName

            );

        messagesDiv.scrollTop =

            messagesDiv.scrollHeight;

    });}