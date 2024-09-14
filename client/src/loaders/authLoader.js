export const verifyEmailToken = async ({ request }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const userId = url.searchParams.get("userId");
  console.log(token);

  if (!token) {
    return { message: "No Token", ok: false };
  }

  try {
    const response = await fetch(
      `http://localhost:3000/auth/verifyemailtoken?token=${token}&userId=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response);

    const { message } = await response.json();
    if (!response.ok) {
      console.log("Error verifying email token");
      return { message: message, ok: response.ok };
    }
    return { message: message, ok: response.ok };
  } catch (error) {
    console.log(error);
  }
};
