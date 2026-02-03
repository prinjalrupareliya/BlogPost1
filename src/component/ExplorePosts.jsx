import { useEffect, useState } from "react";
import "./ExplorePosts.css";
import { FaSearch } from "react-icons/fa";
import Card from "../component/Card";
import { Pagination } from "./Pagination";
import { ToastContainer, toast } from "react-toastify";
import ConfirmationModal from "./ConfirmationModel";
// import ConfirmationModal from "../ConfirmationModel";

const ExplorePosts = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // FORM STATE
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  //for delete
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    body: "",
  });

  const [errors, setErrors] = useState({});

  // ================= FETCH POSTS =================
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://696f41b3a06046ce6185e454.mockapi.io/BolgPostData");

      if (!res.ok) throw new Error("Failed to load posts");

      const data = await res.json();
      const reversed = [...data].reverse();

      setPosts(reversed);
      setFilteredPosts(reversed);
    } catch (error) {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);


  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    setCurrentPage(1);

    const result = posts.filter(
      (item) =>
        item.title.toLowerCase().includes(value.toLowerCase()) ||
        item.body.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredPosts(result);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.body.trim()) newErrors.body = "Body is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================= CREATE / UPDATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      const url = editId
        ? `https://696f41b3a06046ce6185e454.mockapi.io/BolgPostData/${editId}`
        : "https://696f41b3a06046ce6185e454.mockapi.io/BolgPostData";

      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          body: formData.body,
          image: `https://picsum.photos/seed/${Date.now()}/300/200`,
        }),
      });

      if (!res.ok) throw new Error();

      toast.success(editId ? "Post Updated " : "Post Created ");

      setFormData({ title: "", body: "" });
      setEditId(null);
      setIsFormOpen(false);
      fetchPosts();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(`https://696f41b3a06046ce6185e454.mockapi.io/BolgPostData/${id}`);
      if (!res.ok) throw new Error();

      const data = await res.json();
      setFormData({ title: data.title, body: data.body });
      setEditId(id);
      setIsFormOpen(true);

      toast.info("Edit mode enabled ✏️");
    } catch {
      toast.error("Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
  
      const res = await fetch(
        `https://696f41b3a06046ce6185e454.mockapi.io/BolgPostData/${deleteId}`,
        {
           method: "DELETE",
        }
      );
  
      if (!res.ok) {  
          toast.error("Failed to delete post");
      }
      await res.json();
      alert("Post deleted succesfully");
      setDeleteId(null);
      setShowModal(false);
      //refreshlist
      fetchPosts();
    } catch(error) {
      toast.error("Delete API Error:",error.message);
    } finally {
      setLoading(false);  
      setDeleteId(null);
    }
  };
  


  const startIndex = (currentPage - 1) * pageSize;
  const currentItems = filteredPosts.slice(
    startIndex,
    startIndex + pageSize
  );
  const totalPages = Math.ceil(filteredPosts.length / pageSize);

  return (
    <div className="explore-container">
      <ToastContainer />

      <div className="explore-posts">
        <h1>Explore Posts</h1>

        {/* SEARCH INPUT WITH ICON INSIDE */}
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="input-box"
            placeholder="Search Posts"
            value={search}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* CREATE BUTTON */}
      <button className="btn5" onClick={() => setIsFormOpen(!isFormOpen)}>
        {isFormOpen ? "Close Form" : "Create New Post"}
      </button>

      {/* FORM */}
      {isFormOpen && (
        <form className="form-container" onSubmit={handleSubmit}>
          <h3>{editId ? "Update Post" : "Create New Post"}</h3>

          <input
            type="text"
            name="title"
            placeholder="Enter Title"
            value={formData.title}
            onChange={handleChange}
            className="input-class"
          />
          {errors.title && <p className="error">{errors.title}</p>}

          <textarea
            name="body"
            placeholder="Enter Body"
            rows="4"
            value={formData.body}
            onChange={handleChange}
            className="input-class"
          />
          {errors.body && <p className="error">{errors.body}</p>}

          <div>
            <button className="btn4" type="submit">
              {editId ? "Update" : "Submit"}
            </button>
            <button
              type="button"
              className="btn4"
              onClick={() => {
                setIsFormOpen(false);
                setEditId(null);
                setFormData({ title: "", body: "" });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <hr />

      <div className="card-container">
        {loading ? (
          <p>Loading...</p>
        ) : (
          currentItems.map((item) => (
            <Card
              key={item.id}
              id={item.id}
              title={item.title}
              desc={item.body}
              image={item.image}
              from="explore"
              onEdit={() => handleEdit(item.id)}
              onDelete={() => handleDelete(item?.id)}
            />
          ))
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        onPageSizeChange={(size) => {
          setPageSize(Number(size));
          setCurrentPage(1);
        }}
      />

      {showModal && (
        <ConfirmationModal
          title="Delete Post"
          desc="Are you sure you want to delete this post?"
          onConfirm={confirmDelete}
          onClose={() => { setShowModal(false); setDeleteId(null)}}
          confirmBtnText="Delete"
        />
      )}
    </div>
  );
};

export default ExplorePosts;
