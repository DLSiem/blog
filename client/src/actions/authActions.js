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
  });

  const data = await response.json();

  if (response.ok) {
    let { token } = data;
    localStorage.setItem("token", token);
    return redirect("/");
  }
  return json({ message: data.message });
};

export const refreshToken = async () => {
  // const response = await fetch("http://localhost:3000/auth/refreshtoken", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   credentials: "include", // send cookies
  // });
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

    if (response.status === 401) {
      console.log("token message:", data.message);
      return false;
    }

    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const logout = async () => {
  localStorage.removeItem("token");
  return redirect("/");
};
