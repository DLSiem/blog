export const update = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const token = localStorage.getItem("token");
  if (!token) {
    return { message: "Unauthorized" };
  }

  console.log("Data:-", data);
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
    console.log("Response:-", response);
    console.log("User===>", user);
    console.log("Message:-", message);
    return { message, ok: response.ok };
  } catch (error) {
    console.log(error);
  }
  return null;
};
