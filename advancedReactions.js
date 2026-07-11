import { addReaction, removeReaction } from "./message";

const EMOJI_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🔥", "👏", "🎉"];

export function enableAdvancedReactions(roomCode, myName) {
    document.addEventListener("contextmenu", async (e) => {
        const message = e.target.closest(".message");
        
        if (!message) return;

        e.preventDefault();

        const messageId = message.dataset.id;

        if (!messageId) return;

        showReactionPicker(e, messageId, roomCode, myName);
    });

    // Click on reaction to view who reacted
    document.addEventListener("click", (e) => {
        if (e.target.closest(".reaction")) {
            const reaction = e.target.closest(".reaction");
            const emoji = reaction.dataset.emoji;
            const users = reaction.dataset.users?.split(",") || [];

            if (users.length > 0) {
                showReactionUsers(e, emoji, users);
            }
        }
    });
}

function showReactionPicker(e, messageId, roomCode, myName) {
    const existingPicker = document.getElementById("reactionPicker");
    if (existingPicker) existingPicker.remove();

    const picker = document.createElement("div");
    picker.className = "reactionPicker";
    picker.id = "reactionPicker";

    let html = "";
    EMOJI_REACTIONS.forEach((emoji) => {
        html += `
            <div class="reactionEmoji" data-emoji="${emoji}" data-message-id="${messageId}">
                ${emoji}
            </div>
        `;
    });

    picker.innerHTML = html;

    const rect = e.target.closest(".message").getBoundingClientRect();
    picker.style.top = `${e.clientY}px`;
    picker.style.left = `${e.clientX}px`;

    document.body.appendChild(picker);

    picker.querySelectorAll(".reactionEmoji").forEach((btn) => {
        btn.addEventListener("click", async (event) => {
            const emoji = btn.dataset.emoji;
            const msgId = btn.dataset.messageId;

            try {
                await addReaction(roomCode, msgId, myName, emoji);
            } catch (err) {
                console.error("Error adding reaction:", err);
            }

            picker.remove();
        });
    });

    // Close picker when clicking outside
    setTimeout(() => {
        document.addEventListener("click", closePickerListener);
    }, 0);
}

function closePickerListener(e) {
    if (!e.target.closest(".reactionPicker")) {
        const picker = document.getElementById("reactionPicker");
        if (picker) picker.remove();
        document.removeEventListener("click", closePickerListener);
    }
}

function showReactionUsers(e, emoji, users) {
    const tooltip = document.createElement("div");
    tooltip.className = "reactionTooltip";

    tooltip.innerHTML = `
        <div class="tooltipContent">
            <div class="tooltipEmoji">${emoji}</div>
            <div class="tooltipUsers">
                ${users.map((user) => `<div>${user}</div>`).join("")}
            </div>
        </div>
    `;

    tooltip.style.top = `${e.clientY}px`;
    tooltip.style.left = `${e.clientX}px`;

    document.body.appendChild(tooltip);

    setTimeout(() => {
        document.addEventListener("click", () => {
            tooltip.remove();
        }, { once: true });
    }, 0);
}

export function getReactionsHTML(reactions) {
    if (!reactions || Object.keys(reactions).length === 0) return "";

    let html = '<div class="reactions">';

    Object.entries(reactions).forEach(([emoji, users]) => {
        html += `
            <div class="reaction" data-emoji="${emoji}" data-users="${users.join(",")}">
                <span>${emoji}</span>
                <span class="reactionCount">${users.length}</span>
            </div>
        `;
    });

    html += "</div>";
    return html;
}
