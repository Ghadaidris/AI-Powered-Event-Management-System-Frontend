// frontend/src/pages/companyList/CompanyList.jsx
import { useEffect, useState } from 'react';
import { getCompanies, createCompany, updateCompany, deleteCompany } from '../../utilities/users-api';
import Navbar from '../../components/Navbar';
import './CompanyList.css';

export default function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    getCompanies().then(setCompanies);
  }, []);

  const handleSubmit = async () => {
    if (editingId) {
      const updated = await updateCompany(editingId, formData);
      setCompanies(companies.map(c => c.id === editingId ? updated : c));
    } else {
      const newComp = await createCompany(formData);
      setCompanies([...companies, newComp]);
    }
    setShowForm(false);
    setFormData({ name: '', description: '' });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    await deleteCompany(id);
    setCompanies(companies.filter(c => c.id !== id));
  };

  const handleEdit = (comp) => {
    setFormData({ name: comp.name, description: comp.description });
    setEditingId(comp.id);
    setShowForm(true);
  };

  return (
    <>
      <Navbar />
      <div className="list-container">
        <header className="list-header">
          <h1>Companies Management</h1>
          <button className="btn-add" onClick={() => setShowForm(true)}>+ Add Company</button>
        </header>

        {showForm && (
          <div className="form-card">
            <input placeholder="Company Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            <div className="form-actions">
              <button onClick={handleSubmit} className="btn-save">Save</button>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="btn-cancel">Cancel</button>
            </div>
          </div>
        )}

        <div className="grid">
          {companies.map(comp => (
            <div key={comp.id} className="item-card">
              <h3>{comp.name}</h3>
              <p>{comp.description}</p>
              <div className="card-actions">
                <button onClick={() => handleEdit(comp)} className="btn-edit">Edit</button>
                <button onClick={() => handleDelete(comp.id)} className="btn-delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}