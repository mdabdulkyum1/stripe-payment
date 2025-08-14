"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./styles.module.css";
import { apiDelete, apiGet, apiPost, apiUpload } from "./lib/apiClient";
import { ChatSocket } from "./lib/wsClient";

function EmojiPicker({ onSelect }) {
  const emojis = "😀😁😂🤣😊😍😘😎🤔🙄😴😡👍🙏🎉🔥💯🥳👏🤯🤝❤️✨🎈".split("");
  return (
    <div className={styles.emojiPicker}>
      {emojis.map((e) => (
        <button
          type="button"
          key={e}
          className={styles.emojiBtn}
          onClick={() => onSelect(e)}
          aria-label={`emoji ${e}`}
        >
          {e}
        </button>
      ))}
    </div>
  );
}

function RoomList({ rooms, activeRoomId, onSelect, onCreate }) {
  const [name, setName] = useState("");
  return (
    <aside className={styles.sidebar}>
      <div className={styles.roomsHeader}>
        <span>Rooms</span>
        <button onClick={() => onSelect(activeRoomId)} title="Refresh">⟳</button>
      </div>
      <ul className={styles.roomList}>
        {rooms.map((r) => (
          <li key={r.id}>
            <button
              className={r.id === activeRoomId ? styles.activeRoom : styles.roomBtn}
              onClick={() => onSelect(r.id)}
            >
              {r.name}
            </button>
          </li>
        ))}
      </ul>
      <div className={styles.roomCreate}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New room name"
        />
        <button
          onClick={() => {
            if (!name.trim()) return;
            onCreate(name.trim());
            setName("");
          }}
        >
          Create
        </button>
      </div>
    </aside>
  );
}

function MessageItem({ msg, isOwn, onDelete }) {
  return (
    <li className={isOwn ? styles.messageOwn : styles.message}>
      <div className={styles.msgHeader}>
        <span className={styles.author}>{msg.author || "Anon"}</span>
        <span className={styles.time}>{new Date(msg.createdAt || Date.now()).toLocaleTimeString()}</span>
      </div>
      {msg.text && <p className={styles.text}>{msg.text}</p>}
      {msg.attachments?.length ? (
        <div className={styles.attachments}>
          {msg.attachments.map((a, i) => (
            a.type?.startsWith("image/") ? (
              <img key={i} src={a.url} alt={a.name || "image"} className={styles.image} />
            ) : (
              <a key={i} href={a.url} target="_blank" rel="noreferrer" className={styles.file}>
                {a.name || "file"}
              </a>
            )
          ))}
        </div>
      ) : null}
      <div className={styles.msgActions}>
        <button onClick={() => onDelete(msg.id)} title="Delete">🗑️</button>
      </div>
    </li>
  );
}

function Composer({ onSend, onAttach, typing, setTyping }) {
  const [showEmoji, setShowEmoji] = useState(false);
  const inputRef = useRef(null);

  const handleEmoji = (e) => {
    const el = inputRef.current;
    if (!el) return;
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const value = el.value;
    el.value = value.slice(0, start) + e + value.slice(end);
    el.focus();
    const pos = start + e.length;
    el.setSelectionRange(pos, pos);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  };

  return (
    <div className={styles.composer}>
      <div className={styles.controls}>
        <button type="button" onClick={() => setShowEmoji((s) => !s)} title="Emoji">
          😊
        </button>
        <label title="Attach files" className={styles.attachLabel}>
          📎
          <input type="file" multiple hidden onChange={(e) => onAttach([...e.target.files])} />
        </label>
        <input
          ref={inputRef}
          placeholder="Type a message"
          onInput={(e) => setTyping(e.target.value.length > 0)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              const text = e.currentTarget.value.trim();
              if (text) onSend({ text });
              e.currentTarget.value = "";
              setTyping(false);
            }
          }}
        />
        <button
          onClick={() => {
            const el = inputRef.current;
            const text = (el?.value || "").trim();
            if (text) onSend({ text });
            if (el) el.value = "";
            setTyping(false);
          }}
          title="Send"
        >
          Send
        </button>
      </div>
      {showEmoji && <EmojiPicker onSelect={handleEmoji} />}
      {typing && <div className={styles.typing}>Typing…</div>}
    </div>
  );
}

export default function ChatAppPage() {
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [me, setMe] = useState({ id: undefined, name: "" });
  const [isTyping, setIsTyping] = useState(false);
  const [remoteTyping, setRemoteTyping] = useState(false);
  const attachmentsRef = useRef([]);

  const socketRef = useRef(null);

  // Load initial rooms and pick first
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const data = await apiGet("/rooms");
        if (!ignore) {
          setRooms(data.rooms || []);
          setActiveRoom(data.rooms?.[0] || null);
        }
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  // Load messages on room change
  useEffect(() => {
    if (!activeRoom?.id) return;
    let ignore = false;
    (async () => {
      try {
        const data = await apiGet(`/rooms/${activeRoom.id}/messages`);
        if (!ignore) setMessages(data.messages || []);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [activeRoom?.id]);

  // WebSocket
  useEffect(() => {
    const sock = new ChatSocket({
      onOpen: () => console.log("ws open"),
      onClose: () => console.log("ws close"),
      onError: (e) => console.error("ws error", e),
      onMessage: (data) => {
        if (data.type === "message" && data.roomId === activeRoom?.id) {
          setMessages((m) => [...m, data.payload]);
        }
        if (data.type === "delete" && data.roomId === activeRoom?.id) {
          setMessages((m) => m.filter((x) => x.id !== data.messageId));
        }
        if (data.type === "typing" && data.roomId === activeRoom?.id) {
          setRemoteTyping(!!data.isTyping);
        }
      },
    });
    socketRef.current = sock;
    sock.connect();
    return () => {
      socketRef.current = null;
      // underlying ws will close on GC
    };
  }, [activeRoom?.id]);

  // Debounced typing indication
  useEffect(() => {
    if (!activeRoom?.id || !socketRef.current) return;
    socketRef.current.setTyping(activeRoom.id, isTyping, me);
    if (isTyping) {
      const t = setTimeout(() => {
        socketRef.current?.setTyping(activeRoom.id, false, me);
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [isTyping, activeRoom?.id, me]);

  const handleSend = async ({ text }) => {
    if (!activeRoom?.id) return;
    try {
      let uploaded = [];
      if (attachmentsRef.current.length) {
        const res = await apiUpload(`/rooms/${activeRoom.id}/attachments`, attachmentsRef.current);
        uploaded = res.files || [];
        attachmentsRef.current = [];
      }
      const created = await apiPost(`/rooms/${activeRoom.id}/messages`, {
        text,
        attachments: uploaded,
        author: me.name || "Anon",
      });
      // emit via WS helper (optional; server should also broadcast)
      socketRef.current?.sendMessage(activeRoom.id, created);
      setMessages((m) => [...m, created]);
    } catch (e) {
      console.error(e);
      alert("Failed to send message");
    }
  };

  const handleAttach = (files) => {
    attachmentsRef.current = files;
  };

  const handleDelete = async (id) => {
    if (!activeRoom?.id) return;
    try {
      await apiDelete(`/rooms/${activeRoom.id}/messages/${id}`);
      socketRef.current?.deleteMessage(activeRoom.id, id);
      setMessages((m) => m.filter((x) => x.id !== id));
    } catch (e) {
      console.error(e);
      alert("Failed to delete message");
    }
  };

  const createRoom = async (name) => {
    try {
      const room = await apiPost("/rooms", { name });
      setRooms((r) => [...r, room]);
      setActiveRoom(room);
    } catch (e) {
      console.error(e);
      alert("Failed to create room");
    }
  };

  const refreshSelect = async (id) => {
    try {
      const data = await apiGet("/rooms");
      setRooms(data.rooms || []);
      const target = data.rooms?.find((r) => r.id === id) || data.rooms?.[0] || null;
      setActiveRoom(target);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.wrapper}>
      <RoomList
        rooms={rooms}
        activeRoomId={activeRoom?.id}
        onSelect={refreshSelect}
        onCreate={createRoom}
      />
      <section className={styles.chat}>
        <header className={styles.chatHeader}>
          <div className={styles.roomTitle}>{activeRoom?.name || "No room"}</div>
          <div className={styles.me}>
            <input
              placeholder="Your name"
              value={me.name}
              onChange={(e) => setMe((m) => ({ ...m, name: e.target.value }))}
            />
            <span className={styles.typingArea}>{remoteTyping ? "Someone is typing…" : ""}</span>
          </div>
        </header>
        <ul className={styles.messages}>
          {messages.map((m) => (
            <MessageItem key={m.id} msg={m} isOwn={m.author === me.name} onDelete={handleDelete} />)
          )}
        </ul>
        <Composer onSend={handleSend} onAttach={handleAttach} typing={isTyping} setTyping={setIsTyping} />
      </section>
    </div>
  );
}

