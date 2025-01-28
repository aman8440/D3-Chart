import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

interface AddEmployeeFormProps {
  open: boolean;
  onClose: () => void;
  onAdd: (employeeData: EmployeeData) => void;
  parentId: string;
}

interface EmployeeData {
  id: number;
  name: string;
  gender: string;
  age: number;
  height: string;
  designation: string;
  parentId: string;
}

interface FormErrors {
  name?: string;
  gender?: string;
  age?: string;
  height?: string;
  designation?: string;
}

const designations = [
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

const AddEmployeeForm = ({ open, onClose, onAdd, parentId }: AddEmployeeFormProps) => {
  const [formData, setFormData] = useState<EmployeeData>({
    id: 0,
    name: '',
    gender: '',
    age: 0,
    height: '',
    designation: '',
    parentId: parentId
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const storedEmployees = JSON.parse(localStorage.getItem('items') || '[]');

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      id: storedEmployees.length + 1
    }));
    setTouched({});
  }, [open]);

  const validateField = (name: string, value: string | number): string => {
    switch (name) {
      case 'name':
        if (!value) return 'Name is required';
        if (value.toString().length < 2) return 'Name must be at least 2 characters';
        if (value.toString().length > 50) return 'Name must be less than 50 characters';
        return '';
      case 'age':
        { if (!value) return 'Age is required';
        const age = Number(value);
        if (isNaN(age)) return 'Age must be a number';
        if (age < 18) return 'Age must be at least 18';
        if (age > 99) return 'Age must be less than 99';
        return ''; }
      case 'height':
        if (!value) return 'Height is required';
        if (isNaN(Number(value))) return 'Height must be a number';
        if (Number(value) < 100) return 'Height must be at least 100 cm';
        if (Number(value) > 250) return 'Height must be less than 250 cm';
        return '';
      case 'designation':
        if (!value) return 'Designation is required';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value
    }));
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleBlur = (fieldName: string) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error = validateField(fieldName, formData[fieldName as keyof EmployeeData] as any);
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: FormErrors = {};
    let hasErrors = false;
    
    Object.keys(formData).forEach(key => {
      if (key === 'id' || key === 'parentId') return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = validateField(key, formData[key as keyof EmployeeData] as any);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    if (!hasErrors) {
      onAdd(formData);
      onClose();
      setFormData({
        id: storedEmployees.length+1,
        name: '',
        gender: '',
        age: 0,
        height: '',
        designation: '',
        parentId: parentId
      });
      setErrors({});
      setTouched({});
    }
  };

  const getInputClassName = (fieldName: string) => {
    const baseClasses = "mt-1 p-2 w-full border rounded-md";
    const errorClasses = touched[fieldName] && errors[fieldName]
      ? "border-red-500 focus:ring-red-500" 
      : "border-gray-300 focus:ring-blue-500";
    return `${baseClasses} ${errorClasses}`;
  };
  
  // const designationName = storedEmployees.id === parentId ? storedEmployees.designation : '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const designationName = storedEmployees.find((element: any) => element['id'] == parentId)?.designation || '';
  const filteredDesignations = designations.filter(designation => designation !== designationName);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Employee</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => handleBlur('name')}
                className={getInputClassName('name')}
              />
              {touched.name && errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={getInputClassName('gender')}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <input
                type="number"
                name="age"
                min="18"
                max="99"
                value={formData.age || ''}
                onChange={handleChange}
                onBlur={() => handleBlur('age')}
                className={getInputClassName('age')}
              />
              {touched.age && errors.age && (
                <p className="mt-1 text-sm text-red-600">{errors.age}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                onBlur={() => handleBlur('height')}
                className={getInputClassName('height')}
              />
              {touched.height && errors.height && (
                <p className="mt-1 text-sm text-red-600">{errors.height}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Designation</label>
              <select
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                onBlur={() => handleBlur('designation')}
                className={getInputClassName('designation')}
              >
                <option value="">Select Designation</option>
                {filteredDesignations.map(designation => (
                  <option key={designation} value={designation}>
                    {designation}
                  </option>
                ))}
              </select>
              {touched.designation && errors.designation && (
                <p className="mt-1 text-sm text-red-600">{errors.designation}</p>
              )}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddEmployeeForm;