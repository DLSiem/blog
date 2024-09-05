import { json, redirect } from "react-router-dom";

export const authActions = async ({ request }) => {
  const formData = await request.formData();
  const { type, email, password } = Object.fromEntries(formData);

  const response = await fetch(`http://localhost:3000/auth/${type}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (response.ok) {
    return redirect("/");
  }
  return json({ message: data.message });
};
