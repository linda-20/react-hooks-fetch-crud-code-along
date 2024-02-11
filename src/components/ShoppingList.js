import React, { useState, useEffect, useRef } from "react";
import ItemForm from "./ItemForm";
import Filter from "./Filter";
import Item from "./Item";

function ShoppingList() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [items, setItems] = useState([]);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    fetch("http://localhost:4000/items")
      .then((r) => r.json())
      .then((items) => {
        if (isMounted.current) {
          setItems(items);
        }
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      });

    return () => {
      isMounted.current = false;
    };
  }, []);

  function handleAddItem(newItem) {
    setItems((prevItems) => [...prevItems, newItem]);
  }

  function handleUpdateItem(updatedItem) {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  }

  function handleDeleteItem(deletedItem) {
    setItems((prevItems) => prevItems.filter((item) => item.id !== deletedItem.id));
  }

  function handleCategoryChange(category) {
    setSelectedCategory(category);
  }

  const itemsToDisplay = items.filter((item) => {
    if (selectedCategory === "All") return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="ShoppingList">
      <ItemForm onAddItem={handleAddItem} />
      <Filter category={selectedCategory} onCategoryChange={handleCategoryChange} />
      <ul className="Items">
        {itemsToDisplay.map((item) => (
          <Item
            key={item.id}
            item={item}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
          />
        ))}
      </ul>
    </div>
  );
}

export default ShoppingList;
