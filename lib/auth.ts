// Initialize demo data if it doesn't exist
export const initializeDemoData = () => {
  if (typeof window === "undefined") return; // Server-side check

  const existingUsers = localStorage.getItem("snapgrade_users");
  if (!existingUsers) {
    const demoUsers = [
      {
        id: "demo-teacher-1",
        firstName: "Demo",
        lastName: "Teacher",
        email: "demo@teacher.com",
        password: "demo123",
        school: "Demo Elementary School",
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem("snapgrade_users", JSON.stringify(demoUsers));
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("snapgrade_current_user");
};

// Get current user
export const getCurrentUser = () => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("snapgrade_current_user");
  return user ? JSON.parse(user) : null;
};

// Sign out user
export const signOut = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("snapgrade_current_user");
};
