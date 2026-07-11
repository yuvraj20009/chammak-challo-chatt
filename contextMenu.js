import { deleteMessage, editMessage } from "./message";

export function enableContextMenu(roomCode, myName) {
    let longPressTimer = null;
    let currentMessage = null;

    document.addEventListener("mousedown", (e) => {
        const message = e.target.closest(".message");
        
        if (!message) {
            closeContextMenu();
            return;
        }

        const messageId = message.dataset.id;
        const sender = message.dataset.sender;

        // Only show context menu for own messages
        if (sender !== myName) return;

        currentMessage = {
            id: messageId,
            element: message,
            sender: sender
        };

        longPressTimer = setTimeout(() => {
            showContextMenu(e, messageId, sender, roomCode);
        }, 500);
    });

    document.addEventListener("mouseup", () => {
        clearTimeout(longPressTimer);
    });

    document.addEventListener("mouseleave", () => {
        clearTimeout(longPressTimer);
    });

    // Touch support for mobile long-press
    document.addEventListener("touchstart", (e) => {
        const message = e.target.closest(".message");
        
        if (!message) {
            closeContextMenu();
            return;
        }

        const messageId = message.dataset.id;
        const sender = message.dataset.sender;

        if (sender !== myName) return;

        currentMessage = {
            id: messageId,
            element: message,
            sender: sender
        };

        longPressTimer = setTimeout(() => {
            showContextMenu(e, messageId, sender, roomCode);
        }, 500);
    });

    document.addEventListener("touchend", () => {
        clearTimeout(longPressTimer);
    });
}

function showContextMenu(e, messageId, sender, roomCode) {
    closeContextMenu();

    const menu = document.createElement("div");
    menu.className = "contextMenu";
    menu.id = "contextMenu";

    const rect = e.target.closest(".message").getBoundingClientRect();

    menu.innerHTML = `
        <div class="contextMenuItem" data-action="edit">
            ✏️ Edit
        </div>
        <div class="contextMenuItem" data-action="delete">
            🗑️ Delete
        </div>
    `;

    menu.style.top = `${rect.top + rect.height}px`;
    menu.style.left = `${rect.left}px`;

    document.body.appendChild(menu);

    menu.querySelectorAll(".contextMenuItem").forEach((item) => {
        item.addEventListener("click", async (event) => {
            const action = item.dataset.action;

            if (action === "edit") {
                await handleEdit(messageId, roomCode);
            } else if (action === "delete") {
                await handleDelete(messageId, roomCode);
            }

            closeContextMenu();
        });
    });

    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener("click", closeContextMenuListener);
    }, 0);
}

function closeContextMenuListener(e) {
    if (!e.target.closest(".contextMenu")) {
        closeContextMenu();
        document.removeEventListener("click", closeContextMenuListener);
    }
}

export function closeContextMenu() {
    const menu = document.getElementById("contextMenu");
    if (menu) {
        menu.remove();
    }
}

async function handleEdit(messageId, roomCode) {
    const newText = prompt("Edit your message:");
    
    if (newText !== null && newText.trim()) {
        try {
            await editMessage(roomCode, messageId, newText.trim());
        } catch (err) {
            console.error("Error editing message:", err);
            alert("Failed to edit message");
        }
    }
}

async function handleDelete(messageId, roomCode) {
    if (confirm("Are you sure you want to delete this message?")) {
        try {
            await deleteMessage(roomCode, messageId);
        } catch (err) {
            console.error("Error deleting message:", err);
            alert("Failed to delete message");
        }
    }
}
