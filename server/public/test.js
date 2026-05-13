const connectBtn = document.getElementById('connectBtn');
const joinVideoBtn = document.getElementById('joinVideoBtn');
const leaveVideoBtn = document.getElementById('leaveVideoBtn');
const tokenInput = document.getElementById('token');
const logContainer = document.getElementById('log');

let socket;
const videoId = 'c1b2c3d4-0001-4000-8000-000000000001';

function log(message) {
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.textContent = `${new Date().toLocaleTimeString()} - ${message}`;
  logContainer.prepend(entry);
}

function setButtons(connected) {
  joinVideoBtn.disabled = !connected;
  leaveVideoBtn.disabled = !connected;
  connectBtn.textContent = connected ? 'Reconnect' : 'Connect';
}

connectBtn.addEventListener('click', () => {
  const token = tokenInput.value.trim();
  if (!token) {
    log('Token is required to connect.');
    return;
  }

  if (socket && socket.connected) {
    log('Socket is already connected.');
    return;
  }

  socket = io({ auth: { token } });

  socket.on('connect', () => {
    log(`Connected: ${socket.id}`);
    setButtons(true);
    socket.emit('join_video', videoId);
    log(`Emitted join_video for videoId=${videoId}`);
  });

  socket.on('disconnect', (reason) => {
    log(`Disconnected: ${reason}`);
    setButtons(false);
  });

  socket.on('connect_error', (error) => {
    log(`Connect error: ${error.message}`);
  });

  socket.on('error', (error) => {
    log(`Error: ${JSON.stringify(error)}`);
  });

  socket.on('message', (payload) => {
    log(`Message received: ${JSON.stringify(payload)}`);
  });
});

joinVideoBtn.addEventListener('click', () => {
  if (!socket || !socket.connected) {
    log('Socket is not connected.');
    return;
  }
  socket.emit('join_video', videoId);
  log(`Sent join_video for videoId=${videoId}`);
});

leaveVideoBtn.addEventListener('click', () => {
  if (!socket || !socket.connected) {
    log('Socket is not connected.');
    return;
  }
  socket.emit('leave_video', videoId);
  log(`Sent leave_video for videoId=${videoId}`);
});
