export function renderMessages(
    messages,
    myName
) {

    let html = "";

    messages.forEach((message) => {

        const mine =
            message.sender === myName;

        const time =
            message.createdAt?.toDate
                ? message.createdAt
                    .toDate()
                    .toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                    })
                : "";

        html += `

<div class="messageRow ${mine ? "mine" : "other"}">

${mine ? "" : `

<div class="avatar">

<img
src="https://api.dicebear.com/9.x/fun-emoji/svg?seed=${encodeURIComponent(message.sender)}"
/>

</div>

`}

<div
class="message ${mine ? "mineBubble" : "otherBubble"}"
>

<div class="messageTop">

<div class="sender">
${message.sender}
</div>

<div class="time">
${time}
</div>

</div>

${message.image ? `

<img
class="chatImage"
src="${message.image}"
data-image="${message.image}"
/>

` : ""}

${message.text ? `

<div class="text">

${message.text}

</div>

` : ""}

</div>

</div>

`;

    });

    return html;

}