const PASTOR_CREDENTIALS = {
  name: "Pallapati Cornelius",
  password: "Pallapati Cornelius"
};

const AUTH_STORAGE_KEY = "tmcf_pastor_auth_session";

export const authenticatePastor = (nameInput, passwordInput) => {
  if (!nameInput || !passwordInput) {
    return { success: false, message: "Please enter both Pastor Name and Password." };
  }

  const cleanName = nameInput.trim();
  const cleanPassword = passwordInput.trim();

  const isNameValid = cleanName.toLowerCase() === PASTOR_CREDENTIALS.name.toLowerCase();
  const isPasswordValid = cleanPassword === PASTOR_CREDENTIALS.password;

  if (isNameValid && isPasswordValid) {
    const sessionData = {
      isPastor: true,
      pastorName: PASTOR_CREDENTIALS.name,
      loggedInAt: new Date().toISOString()
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData));
    return { success: true, user: sessionData };
  } else {
    return { 
      success: false, 
      message: "Invalid credentials. Please enter the correct Pastor Name and Password." 
    };
  }
};

export const checkIsPastorLoggedIn = () => {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!saved) return false;
    const session = JSON.parse(saved);
    return Boolean(session?.isPastor);
  } catch (err) {
    console.error("Auth check failed:", err);
    return false;
  }
};

export const logoutPastor = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const getPastorSession = () => {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (err) {
    return null;
  }
};
