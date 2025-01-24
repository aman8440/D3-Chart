import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Listing = () => {
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem("items");
    return savedItems
      ? JSON.parse(savedItems)
      : [
          { id: 1, name: "John Doe", gender: "Male", age: 28, height: "152" },
          {
            id: 2,
            name: "Jane Smith",
            gender: "Female",
            age: 24,
            height: "160",
          },
          {
            id: 3,
            name: "Sam Johnson",
            gender: "Male",
            age: 30,
            height: "152",
          },
        ];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    gender: "Male",
    age: "",
    height: "",
  });
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/chart");
  };

  const [validationErrors, setValidationErrors] = useState({
    name: false,
    age: false,
    height: false,
  });

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when typing
    if (name === "name" || name === "age" || name === "height") {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  const handleAddItem = () => {
    const ageNum = parseInt(newItem.age);
    const errors = {
      name: !newItem.name,
      age: !ageNum || ageNum < 18 || ageNum > 99,
      height: !newItem.height,
    };

    setValidationErrors(errors);

    if (Object.values(errors).some((error) => error)) {
      return;
    }

    setItems((prev: any) => [
      ...prev,
      {
        id: prev.length + 1,
        ...newItem,
        age: ageNum,
      },
    ]);

    // Reset modal and form
    setNewItem({
      name: "",
      gender: "Male",
      age: "",
      height: "",
    });
    setValidationErrors({
      name: false,
      age: false,
      height: false,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mx-4 rounded transition-colors"
          onClick={handleNavigate}
        >
          Org Chart
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Add New Item
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-bold mb-4">Add New Person</h2>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={newItem.name}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${
                    validationErrors.name ? "border-red-500" : ""
                  }`}
                />
                {validationErrors.name && (
                  <p className="text-red-500 text-xs mt-1">Name is required</p>
                )}
              </div>

              <select
                name="gender"
                value={newItem.gender}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <div>
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  min="18"
                  max="99"
                  value={newItem.age}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${
                    validationErrors.age ? "border-red-500" : ""
                  }`}
                />
                {validationErrors.age && (
                  <p className="text-red-500 text-xs mt-1">
                    Age must be between 18 and 99
                  </p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="height"
                  placeholder="Height (e.g., 160cm)"
                  value={newItem.height}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${
                    validationErrors.height ? "border-red-500" : ""
                  }`}
                />
                {validationErrors.height && (
                  <p className="text-red-500 text-xs mt-1">
                    Height is required
                  </p>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddItem}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            {["Name", "Gender", "Age", "Height"].map((header) => (
              <th
                key={header}
                className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items.map((item: any) => (
            <tr
              key={item.id}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="py-4 px-4 text-sm text-gray-900">{item.name}</td>
              <td className="py-4 px-4 text-sm text-gray-700">{item.gender}</td>
              <td className="py-4 px-4 text-sm text-gray-700">{item.age}</td>
              <td className="py-4 px-4 text-sm text-gray-700">
                {item.height} &nbsp;cm
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Listing;
