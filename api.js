const API_BASE_URL = `${window.location.origin}/api`;

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("tf_current_user") || "null");
}

function setCurrentUser(user) {
  localStorage.setItem("tf_current_user", JSON.stringify(user));
}

async function registerUser(payload) {
  const data = await apiRequest("/auth?action=register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  setCurrentUser(data.user);
  return data.user;
}

async function loginUser(payload) {
  const data = await apiRequest("/auth?action=login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  setCurrentUser(data.user);
  return data.user;
}

async function saveSession(session) {
  const user = getCurrentUser();
  if (!user?.id) {
    const fallbackSessions = JSON.parse(localStorage.getItem("tf_sessions") || "[]");
    fallbackSessions.push(session);
    if (fallbackSessions.length > 100) fallbackSessions.shift();
    localStorage.setItem("tf_sessions", JSON.stringify(fallbackSessions));
    return null;
  }

  return apiRequest("/sessions", {
    method: "POST",
    body: JSON.stringify({ ...session, userId: user.id })
  });
}

async function getUserSessions() {
  const user = getCurrentUser();
  if (!user?.id) {
    return JSON.parse(localStorage.getItem("tf_sessions") || "[]");
  }

  const data = await apiRequest(`/sessions?userId=${encodeURIComponent(user.id)}`);
    return data.sessions.map((session) => ({
      userId: user.id,
      date: session.createdAtClient || session.createdAt,
      wpm: session.wpm,
      acc: session.acc,
      errors: session.errorCount ?? session.errors ?? 0,
      time: session.time,
      cat: session.cat,
      mode: session.mode,
      challengeKey: session.challengeKey || null
  }));
}

async function clearUserSessions() {
  const user = getCurrentUser();
  if (!user?.id) {
    localStorage.removeItem("tf_sessions");
    return;
  }

  await apiRequest(`/sessions?userId=${encodeURIComponent(user.id)}`, {
    method: "DELETE"
  });
}

async function getLeaderboard() {
  const data = await apiRequest("/leaderboard");
  return data.leaderboard;
}
