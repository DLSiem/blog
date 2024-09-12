// create blog

export const createBlog = async ({ request }) => {
  const req = await request.formData();
  const blogData = Object.fromEntries(req);

  console.log("blog", blogData);
  try {
    const response = await fetch("http://localhost:3000/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(blogData),
    });

    const data = await response.json();
    return { blog: data.blog, ok: response.ok, message: data.message };
  } catch (error) {
    console.log(error);
    return null;
  }
};

// update blog

export const updateBlog = async ({ request, params }) => {
  const { slug } = params;

  const req = await request.formData();
  const blogData = Object.fromEntries(req);

  console.log("blog", blogData);
  try {
    const response = await fetch(`http://localhost:3000/${slug}/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(blogData),
    });
    const data = await response.json();
    return { blog: data.blog, ok: response.ok, message: data.message };
  } catch (error) {
    console.log(error);
    return null;
  }
};

// delete blog
