<script lang="ts">
  import { onMount } from 'svelte';
  import ChatContainer from '$lib/components/ChatContainer.svelte';
  
  let username = "";
  let ws: WebSocket;
  
  function connectWebSocket() {
    ws = new WebSocket("ws://localhost:3000/chat");
    ws.onopen = () => {
      console.log("WebSocket connection opened");
      ws.send(JSON.stringify({ type: 'join', username }));
    };
    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };
  }
  
  onMount(() => {
    username = prompt("Enter your username:") || "Anonymous";
    connectWebSocket();
    return () => {
      if (ws) {
        ws.close();
      }
    };
  });
</script>

<main>
  <ChatContainer {username} {ws} />
</main>

<style>
  main {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
</style>