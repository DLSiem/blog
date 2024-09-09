// get all blogs

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
    return { blog: data, ok: response.ok };
  } catch (error) {
    console.log(error);
    return null;
  }
};
