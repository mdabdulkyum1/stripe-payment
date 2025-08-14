// Route-specific layout for /chat-app
export const metadata = {
  title: 'Chat App',
};

export default function ChatLayout({ children }) {
  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {children}
    </div>
  );
}

