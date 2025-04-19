import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Notification from "./components/Notification";
import Home from "./pages/Home";
import Trade from "./pages/Trade";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const [account, setAccount] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Add notification
  const addNotification = (message, type = "success") => {
    setNotifications([...notifications, { message, type, id: Date.now() }]);
  };

  // Remove notification
  const removeNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <Router>
      <div style={{ minHeight: "100vh" }}>
        <Navbar account={account} setAccount={setAccount} />
        <div style={{ paddingTop: "4rem" }}>
          <Routes>
            <Route path="/" element={<Home account={account} addNotification={addNotification} />} />
            <Route path="/trade" element={<Trade account={account} addNotification={addNotification} />} />
            <Route path="/profile" element={<ProfilePage account={account} />} />
          </Routes>
        </div>
        {notifications.map((n) => (
          <Notification
            key={n.id}
            message={n.message}
            type={n.type}
            onClose={() => removeNotification(n.id)}
          />
        ))}
      </div>
    </Router>
  );
}

export default App;