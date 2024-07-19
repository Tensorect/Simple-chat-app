<script lang="ts">
  import MessageList from '$lib/components/MessageList.svelte';
  import MessageInput from '$lib/components/MessageInput.svelte';
  
  export let username: string;
  export let ws: WebSocket;
  
  let messages: any[] = [];
  let users: string[] = [];
  
  $: {
    if (ws) {
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'message' || data.type === 'live') {
          updateMessages(data);
        } else if (data.type === 'delete') {
          messages = messages.filter(m => m.id !== data.id);
        } else if (data.type === 'userList') {
          users = data.users;
        }
      };
    }
  }
  
  function updateMessages(data: any) {
    const existingMessageIndex = messages.findIndex(m => m.id === data.id);
    if (existingMessageIndex !== -1) {
      messages[existingMessageIndex] = data;
    } else {
      messages = [...messages, data];
    }
    messages = messages;
  }
  
  function deleteMessage(id: number) {
    ws.send(JSON.stringify({ type: 'delete', id }));
    messages = messages.filter(m => m.id !== id);
  }

  function addMessage(messageData: any) {
    updateMessages(messageData);
  }
</script>

<div class="chat-container">
  <MessageList {messages} {username} {deleteMessage} />
  <MessageInput {username} {ws} {users} {addMessage} />
</div>

<style>
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 80vh;
    border: 1px solid #ccc;
    border-radius: 5px;
    overflow: hidden;
  }
</style>