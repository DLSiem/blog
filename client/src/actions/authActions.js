import { json, redirect } from "react-router-dom";

export const authActions = async ({ request }) => {
  const formData = await request.formData();
  const { type, email, password } = Object.fromEntries(formData);
  console.log("Type", type);

  const response = await fetch(`http://localhost:3000/auth/${type}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type, email, password }),
    credentials: "include", // send cookies with the request to the server for session management (login)
  });

  console.log("Response:", response);

  const data = await response.json();

  console.log("Data", data);

  if (response.ok) {
    let { token } = data;
    localStorage.setItem("token", token);
    return redirect("/");
  }
  return json({ message: data.message });
};

export const refreshToken = async () => {
  console.log("Refreshing token...");
  const response = await fetch("http://localhost:3000/auth/refreshtoken", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // send cookies
  });

  if (response.status === 200) {
    const data = await response.json();
    let { token } = data;
    localStorage.setItem("token", token);
    console.log("Token refreshed");
    return true;
  }
  return false;
};

export const isAutheticated = async () => {
  let token = localStorage.getItem("token");
  if (!token) {
    return false;
  }
  try {
    const response = await fetch("http://localhost:3000/auth/protected", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    if (response.status === 401 && data.error === "TokenExpiredError") {
      console.log("Token expired");
      const response = await refreshToken();
      if (response) {
        console.log("Token refreshed successfully......");
        return true;
      } else {
        return false;
      }
    }

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error:", error);
    return false;
  }
};

export const logout = async () => {
  localStorage.removeItem("token");
  return redirect("/");
};