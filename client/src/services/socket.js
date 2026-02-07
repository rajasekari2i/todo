import { io } from 'socket.io-client'

let socket = null

export const connectSocket = () => {
  const token = localStorage.getItem('token')
  if (!token || socket?.connected) return

  const serverUrl = import.meta.env.VITE_SOCKET_URL
  if (!serverUrl && typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
    // No socket URL configured and not running locally — skip socket connection (e.g. Vercel)
    return
  }

  socket = io(serverUrl || 'http://localhost:3001', {
    auth: { token }
  })

  socket.on('connect', () => {
    console.log('Socket connected')
  })

  socket.on('disconnect', () => {
    console.log('Socket disconnected')
  })

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message)
  })

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const getSocket = () => socket

export const onNotification = (callback) => {
  if (socket) {
    socket.on('notification', callback)
  }
}

export const offNotification = (callback) => {
  if (socket) {
    socket.off('notification', callback)
  }
}
