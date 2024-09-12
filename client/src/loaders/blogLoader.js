import { json } from "react-router-dom";

export const getBlog = async () => {
  try {
    const response = await fetch("http://localhost:3000/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return { blogs: data, ok: response.ok };
  } catch (error) {
    console.log(error);
    return null;
  }
};

// get blog by slug

export const getBlogBySlug = async ({ params }) => {
  const { slug } = params;

  try {
    const response = await fetch(`http://localhost:3000/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return json({ blog: data, ok: response.ok });
  } catch (error) {
    console.log(error);
    return null;
  }
};

// get authors blogs

export const fetchUserBlogs = async ({ params }) => {
  const { userId } = params;
  try {
    const response = await fetch(`http://localhost:3000/author/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      console.log("Error fetching user blogs");
      return;
    }

    return { blogs: data, ok: response.ok };
  } catch (error) {
    console.log(error);
  }
};
