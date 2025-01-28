/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const Listing = () => {
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem("items");
    return savedItems
      ? JSON.parse(savedItems)
      : [
          { id: 1, name: "John Doe", gender: "Male", age: 28, height: "152", designation: "CEO", parentId: null },
          {
            id: 2,
            name: "Jane Smith",
            gender: "Female",
            age: 24,
            height: "160",
            designation: "Designer",
            parentId: 1
          },
          {
            id: 3,
            name: "Sam Johnson",
            gender: "Male",
            age: 30,
            height: "152",
            designation: "Manager",
            parentId: 1
          },
          {
            id: 4,
            name: "Sant Thomas",
            gender: "Male",
            age: 29,
            height: "172",
            designation: "Developer",
            parentId: 3
          },
        ];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    gender: "Male",
    age: "",
    height: "",
    designation: "",
    parentId: null as number | null,
  });
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/chart");
  };

  const [validationErrors, setValidationErrors] = useState({
    name: false,
    age: false,
    height: false,
    designation: false,
    parentId: false,
  });

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    
    if (name === 'parentId') {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const selectedParent = items.find((item: any) => item.id === Number(value));
      setNewItem((prev) => ({
        ...prev,
        parentId: Number(value),
        designation: '', // Reset designation when parent changes
      }));
    } else if (name === 'designation') {
      setNewItem((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setNewItem((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if ([ 'CEO',
      'CTO',
      'Project Manager',
      'Team Lead',
      'Senior Developer',
      'Junior Developer',
      'HR Manager',
      'Product Manager',
      'Business Analyst',
      'QA Engineer'].includes(name)) {
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
      designation: !newItem.designation,
      parentId: !newItem.parentId,
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

    setNewItem({
      name: "",
      gender: "Male",
      age: "",
      height: "",
      designation: "",
      parentId: null,
    });
    setValidationErrors({
      name: false,
      age: false,
      height: false,
      designation: false,
      parentId: false,
    });
    setIsModalOpen(false);
  };

  const designationOptions = [
    'CEO',
    'CTO',
    'Project Manager',
    'Team Lead',
    'Senior Developer',
    'Junior Developer',
    'HR Manager',
    'Product Manager',
    'Business Analyst',
    'QA Engineer'
  ];

  const availableDesignations = useMemo(() => {
    if (!newItem.parentId) return designationOptions;
    
    const parentDesignation = items.find((item: any) => item.id === newItem.parentId)?.designation;
    return designationOptions.filter(option => option !== parentDesignation);
  }, [newItem.parentId, items]);

  const availableParents = useMemo(() => {
    return items.filter((item: any) => {
      // Exclude items that are already children
      const isParentOfSomeone = items.find((child: any) => child.parentId === item.id);
      return !isParentOfSomeone;
    });
  }, [items]);

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

              <div>
                <select
                  name="parentId"
                  value={newItem.parentId || ''}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${
                    validationErrors.parentId ? "border-red-500" : ""
                  }`}
                  required
                >
                  <option value="">Select Parent</option>
                  {availableParents.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.name} - {item.designation}
                    </option>
                  ))}
                </select>
                {validationErrors.parentId && (
                  <p className="text-red-500 text-xs mt-1">
                    Parent is required
                  </p>
                )}
              </div>

              <div>
                <select
                  name="designation"
                  value={newItem.designation}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${
                    validationErrors.designation ? "border-red-500" : ""
                  }`}
                  disabled={!newItem.parentId}
                >
                  <option value="">Select Designation</option>
                  {availableDesignations.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {validationErrors.designation && (
                  <p className="text-red-500 text-xs mt-1">
                    Designation is required
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
            {["Name", "Gender", "Age", "Height", "Designation", "Parent"].map((header) => (
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
                {item.height}&nbsp;cm
              </td>
              <td className="py-4 px-4 text-sm text-gray-700">{item.designation}</td>
              <td className="py-4 px-4 text-sm text-gray-700">
                {items.find((p: any) => p.id === item.parentId)?.name || 'Parent'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Listing;