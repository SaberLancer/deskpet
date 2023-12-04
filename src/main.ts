import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'

createApp(App).use(router).mount('#app').$nextTick(() => {
  // Remove Preload scripts loading
  postMessage({ payload: 'removeLoading' }, '*')

  // Use contextBridge
  window?.ipcRenderer?.on('mainScreen', (_event, message) => {
    localStorage.setItem('mainScreen', JSON.stringify(message))
  })

  // window.ipcRenderer.send('message-to-main', 'Hello from renderer process!');
})
