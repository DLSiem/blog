export const refreshToken = async () => {
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

    return true;
  }
  return false;
};

export const isTokenValid = async () => {
  let token = localStorage.getItem("token");
  if (!token) {
    // console.log(false);
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
      const response = await refreshToken();
      if (response) {
        console.log(true);
        return true;
      } else {
        console.log(false);
        return false;
      }
    }

    if (response.status === 200) {
      console.log(true);
      return true;
    } else {
      console.log(false);
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
