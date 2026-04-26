import { useState, useEffect } from 'react';
import { Pencil, Trash2, PlusCircle, List, BookOpen, Users, Star } from 'lucide-react';

const API_URL = "http://localhost:8000";

function App() {
  const [activeTab, setActiveTab] = useState('book-list');
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const fetchData = async (tab) => {
    try {
      const category = tab.split('-')[0];
      const res = await fetch(`${API_URL}/${category}/list`);
      const result = await res.json();
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Lỗi fetch:", err);
      setData([]);
    }
  };

  useEffect(() => {
    if (activeTab.includes('list')) {
      fetchData(activeTab);
    }
    setFormData({});
    setErrors({});
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const category = activeTab.split('-')[0];

    if (Object.keys(formData).length === 0) {
      setErrors({ all: "Vui lòng nhập thông tin!" });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${category}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert("Thêm thành công!");
        setFormData({});
        const listTab = `${category}-list`;
        setActiveTab(listTab);
        fetchData(listTab); 
      }
    } catch (err) {
      alert("Lỗi kết nối server!");
    }
  };

  // 3. Hàm XÓA
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
      const category = activeTab.split('-')[0];
      await fetch(`${API_URL}/${category}/delete/${id}`, { method: 'DELETE' });
      fetchData(activeTab);
    }
  };

  const handleUpdate = async (item) => {
    const category = activeTab.split('-')[0];
    const oldValue = item.username || item.title || item.review;
    const newValue = prompt("Nhập giá trị mới:", oldValue);

    if (newValue && newValue !== oldValue) {
      let payload = {};
      if (category === 'auth') payload = { username: newValue };
      else if (category === 'book') payload = { title: newValue, author: item.author };
      else if (category === 'review') payload = { book: item.book, review: newValue };

      await fetch(`${API_URL}/${category}/update/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      fetchData(activeTab);
      alert("Cập nhật thành công!");
    }
  };

  return (
    <div style={{ display: 'flex', fontFamily: 'Arial', minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
      {/* SIDEBAR */}
      <div style={{ width: '260px', background: '#2c3e50', color: 'white', padding: '20px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f1c40f' }}><BookOpen /> HAIBAZO</h2>
        <hr style={{ borderColor: '#34495e', margin: '20px 0' }} />
        
        {['auth', 'book', 'review'].map(id => (
          <div key={id} style={{ marginBottom: '25px' }}>
            <b style={{ color: '#bdc3c7', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {id === 'auth' ? <Users size={16}/> : id === 'book' ? <BookOpen size={16}/> : <Star size={16}/>}
              {id.toUpperCase()}
            </b>
            <div onClick={() => setActiveTab(`${id}-list`)} style={{ cursor: 'pointer', padding: '10px', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: activeTab === `${id}-list` ? '#34495e' : '' }}>
              <List size={14}/> List
            </div>
            <div onClick={() => setActiveTab(`${id}-create`)} style={{ cursor: 'pointer', padding: '10px', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: activeTab === `${id}-create` ? '#34495e' : '' }}>
              <PlusCircle size={14}/> Create
            </div>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, padding: '40px' }}>
        <h1>{activeTab.toUpperCase().replace('-', ' > ')}</h1>
        
        {activeTab.includes('list') ? (
          <table border="1" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
            <thead>
              <tr style={{ background: '#ecf0f1' }}>
                <th style={styles.th}>ID</th>
                {data.length > 0 && Object.keys(data[0]).filter(k => k !== 'id').map(k => <th key={k} style={styles.th}>{k.toUpperCase()}</th>)}
                <th style={{ ...styles.th, backgroundColor: '#f1c40f' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, i) => (
                <tr key={i}>
                  <td style={styles.td}>{item.id}</td>
                  {Object.entries(item).filter(([k]) => k !== 'id').map(([k, v], j) => <td key={j} style={styles.td}>{v}</td>)}
                  <td style={{ backgroundColor: '#fef9e7', textAlign: 'center' }}>
                    <button onClick={() => handleUpdate(item)} style={styles.btn}><Pencil size={14}/></button>
                    <button onClick={() => handleDelete(item.id)} style={styles.btn}><Trash2 size={14}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '400px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {activeTab === 'auth-create' && (
                <input placeholder="Author Name" style={styles.input} onChange={e => setFormData({username: e.target.value})} />
              )}
              {activeTab === 'book-create' && (
                <>
                  <input placeholder="Title" style={styles.input} onChange={e => setFormData({...formData, title: e.target.value})} />
                  <input placeholder="Author" style={styles.input} onChange={e => setFormData({...formData, author: e.target.value})} />
                </>
              )}
              {activeTab === 'review-create' && (
                <>
                  <input placeholder="Book Name" style={styles.input} onChange={e => setFormData({...formData, book: e.target.value})} />
                  <textarea placeholder="Review" style={{...styles.input, height: '100px'}} onChange={e => setFormData({...formData, review: e.target.value})} />
                </>
              )}
              {errors.all && <span style={{ color: 'red' }}>{errors.all}</span>}
              <button type="submit" style={{ padding: '10px', background: '#27ae60', color: 'white', border: 'none', cursor: 'pointer' }}>Create</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  th: { padding: '12px', textAlign: 'left' },
  td: { padding: '12px' },
  btn: { border: 'none', background: 'none', cursor: 'pointer', margin: '0 5px' },
  input: { padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }
};

export default App; 