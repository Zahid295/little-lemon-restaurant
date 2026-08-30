import React, { useEffect, useState, useCallback } from "react";
// import specials from "../data/specials";
import SpecialsCard from "../components/Highlights/SpecialsCard";
import "./MenuPage.css";

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(6);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMenuItems = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        search,
        category,
        page,
        perpage: perPage,
      });

      const response = await fetch(
        `http://127.0.0.1:8000/api/menu-items?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch menu items");
      }

      const data = await response.json();
      setMenuItems(data)
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, category, page, perPage]);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  return (
    <section className="menu-page">
      <h1 className="menu-title">Our Menu</h1>

      <input 
      type="text" 
      placeholder="Search items..." 
      value={search} onChange={(e) => {
        setPage(1);
        setSearch(e.target.value);
      }}/>

      <select
      value={category}
      onChange={(e) => {
          setPage(1);
          setCategory(e.target.value);
        }}
      >
        <option value="">All Categories</option>
        <option value="starters">Starters</option>
        <option value="mains">Mains</option>
        <option value="desserts">Desserts</option>
        <option value="drinks">Drinks</option>
      </select>

      {loading && <p>Loading menu...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="menu-items">
        {menuItems.length === 0 && !loading && <p>No items found.</p>}

        {menuItems.map((item) => (
          <SpecialsCard 
          key={item.id} 
          item={item} 
          showOrderLink={false}
          showAddToCart={false}/>
        ))}
      </div>

            <div className="pagination">
        <button
          disabled={page <= 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </button>

        <span>Page {page}</span>

        <button
          disabled={menuItems.length < perPage}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
}



