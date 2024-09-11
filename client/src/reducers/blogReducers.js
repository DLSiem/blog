// Define action types
export const CREATE_BLOG = "CREATE_BLOG";
export const EDIT_BLOG = "EDIT_BLOG";
export const DELETE_BLOG = "DELETE_BLOG";
export const FETCH_ERROR = "FETCH_ERROR";

// Initial state

export const createInitialState = () => ({
  blogs: [],
  loading: false,
  error: null,
});

// Reducer function
export const blogReducer = (state, action) => {
  switch (action.type) {
    case CREATE_BLOG:
      return { ...state, blogs: [...state.blogs, action.payload] };

    case EDIT_BLOG:
      return {
        ...state,
        blogs: state.blogs.map((blog) =>
          blog._id === action.payload._id ? action.payload : blog
        ),
      };

    case DELETE_BLOG:
      return {
        ...state,
        blogs: state.blogs.filter((blog) => blog._id !== action.payload),
      };
    default:
      return state;
  }
};

// Async action creators

export const createBlog = async (dispatch, newBlog) => {
  try {
    const response = await fetch("/api/blogs", newBlog);
    dispatch({ type: CREATE_BLOG, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_ERROR, payload: error.message });
  }
};

export const editBlog = async (dispatch, updatedBlog) => {
  try {
    const response = await fetch(`/api/blogs/${updatedBlog._id}`, updatedBlog);
    dispatch({ type: EDIT_BLOG, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_ERROR, payload: error.message });
  }
};

export const deleteBlog = async (dispatch, blogId) => {
  try {
    await fetch(`/api/blogs/${blogId}`);
    dispatch({ type: DELETE_BLOG, payload: blogId });
  } catch (error) {
    dispatch({ type: FETCH_ERROR, payload: error.message });
  }
};
