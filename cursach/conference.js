let localStream;
let peerConnections = {};
const localVideo = document.getElementById('localVideo');
const remoteVideos = document.getElementById('remoteVideos');
const messageInput = document.getElementById('messageInput');
const sendMessageButton = document.getElementById('sendMessage');
const messagesContainer = document.getElementById('messages');

// Настройка WebSocket
const socket = new WebSocket('ws://localhost:8080');

socket.onopen = () => {
    console.log('Connected to signaling server');
    startLocalStream();
};

socket.onmessage = async (event) => {
    const message = JSON.parse(event.data);
    console.log('Received message:', message);

    if (message.type === 'offer') {
        const peerConnection = createPeerConnection(message.from);
        await peerConnection.setRemoteDescription(new RTCSessionDescription(message.sdp));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        socket.send(JSON.stringify({ type: 'answer', to: message.from, sdp: answer }));
    } else if (message.type === 'answer') {
        const peerConnection = peerConnections[message.from];
        await peerConnection.setRemoteDescription(new RTCSessionDescription(message.sdp));
    } else if (message.type === 'candidate') {
        const peerConnection = peerConnections[message.from];
        await peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
    } else if (message.type === 'message') {
        addMessageToChat(message.text, message.from);
    }
};

async function startLocalStream() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;
        createOffer();
    } catch (error) {
        console.error('Error accessing media devices:', error);
    }
}

function createPeerConnection(from) {
    const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });
    peerConnections[from] = peerConnection;

    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            console.log("Sending ICE candidate:", event.candidate);
            socket.send(JSON.stringify({
                type: 'candidate',
                to: from,
                candidate: event.candidate
            }));
        }
    };

    peerConnection.ontrack = (event) => {
        console.log("Received track:", event.streams[0]);
        const remoteVideo = document.createElement('video');
        remoteVideo.srcObject = event.streams[0];
        remoteVideo.autoplay = true;
        remoteVideos.appendChild(remoteVideo);
    };

    return peerConnection;
}

async function createOffer() {
    const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            console.log("Sending ICE candidate:", event.candidate);
            socket.send(JSON.stringify({
                type: 'candidate',
                candidate: event.candidate
            }));
        }
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.send(JSON.stringify({ type: 'offer', sdp: offer }));
}

sendMessageButton.addEventListener('click', () => {
    const text = messageInput.value.trim();
    if (text) {
        socket.send(JSON.stringify({ type: 'message', text }));
        addMessageToChat(text, 'Вы');
        messageInput.value = '';
    }
});

function addMessageToChat(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${sender}: ${text}`;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
