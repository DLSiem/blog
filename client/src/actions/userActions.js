export const update = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const token = localStorage.getItem("token");
  if (!token) {
    return { message: "Unauthorized" };
  }

  try {
    const response = await fetch("http://localhost:3000/user/update", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const { message, user } = await response.json();
    return { message, ok: response.ok, user };
  } catch (error) {
    console.log(error);
  }
  return null;
};
