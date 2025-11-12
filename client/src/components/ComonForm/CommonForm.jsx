import React from "react";

export default function CommonForm({ fields, formData, setFormData, onSubmit, btnText }) {
  return (
    <form onSubmit={onSubmit} className="form-box">
      {fields.map((f) => (
        <div key={f.name} className="form-field">
          <label>{f.label}</label>
          <input
            type={f.type || "text"}
            placeholder={f.placeholder || ""}
            value={formData[f.name] || ""}
            onChange={(e) =>
              setFormData({ ...formData, [f.name]: e.target.value })
            }
          />
        </div>
      ))}
      <button type="submit">{btnText}</button>
    </form>
  );
}
