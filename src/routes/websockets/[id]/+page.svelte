<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  
  let displayText: string = "";
  let ws: WebSocket;
  let from: string = "";
  
  function connectWebSocket() {
    const id = $page.params.id;
    ws = new WebSocket(`ws://localhost:3000/websockets/${id}`);
    
    ws.onopen = () => {
      console.log("WebSocket connection opened");
    };
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (message.type === 'meta') {
        from = message.from;
      } else if (message.type === 'delete') {
        displayText = displayText.slice(0, -message.count);
      } else if (message.type === 'add') {
        displayText += message.text;
      }
    };
    
    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };
  }
  
  onMount(() => {
    connectWebSocket();
    
    return () => {
      if (ws) {
        ws.close();
      }
    };
  });
  </script>
  
  <h1>WebSocket Viewer</h1>
  {#if from}
    <h2>From: {from}</h2>
  {/if}
  <p>{displayText}</p>
  <p>This page displays updates from the connected input source.</p>