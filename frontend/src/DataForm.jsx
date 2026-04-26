import { useState } from 'react';

const DataForm = ({ fields, onSubmit }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.value) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateAndSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    fields.forEach(f => {
      if (!formData[f.name]) newErrors[f.name] = `* Please enter ${f.label.toLowerCase()}`;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      onSubmit(formData);
    }
  };

  return (
    <form className="haibazo-form" onSubmit={validateAndSubmit}>
      {fields.map(f => (
        <div key={f.name} className="form-group">
          <label>{f.label}</label>
          <input name={f.name} onChange={handleChange} />
          {errors[f.name] && <p className="error-text">{errors[f.name]}</p>}
        </div>
      ))}
      <button type="submit" className="btn-create">Create</button>
    </form>
  );
};

export default DataForm;