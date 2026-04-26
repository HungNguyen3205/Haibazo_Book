import { useState, useEffect, useCallback } from 'react';
import { Pencil, Trash2, PlusCircle, List, BookOpen, Users, Star } from 'lucide-react';

// DỮ LIỆU MẪU ĐỂ ĐI NỘP BÀI (Giám khảo mở lên là thấy có data ngay)
const initialData = {
  auth: [
    { id: 1, username: "Hung Nguyen" },
    { id: 2, username: "Haibazo Admin" }
  ],
  book: [
    { id: 1, title: "Lập trình React cơ bản", author: "Hung Nguyen" },
    { id: 2, title: "Kỹ thuật Frontend chuyên sâu", author: "Haibazo" }
  ],
  review: [
    { id: 1, book: "Lập trình React cơ bản", review: "Sách viết rất dễ hiểu, phù hợp cho người mới." }
  ]
};

function App() {
  const [activeTab, setActiveTab] = useState('book-list');
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  // HÀM LẤY DỮ LIỆU TỪ LOCAL STORAGE
  const fetchData = useCallback((tab) => {
    const category = tab.split('-')[0];
    const savedData = localStorage.getItem(`hb_${category}`);
    
    if (savedData) {
      setData(JSON.parse(savedData));
    } else {
      // Nếu chưa có dữ liệu trong máy, dùng dữ liệu mẫu ban đầu
      localStorage.setItem(`hb_${category}`, JSON.stringify(initialData[category]));
      setData(initialData[category]);
    }
  }, []);

  useEffect(() => {
    if (activeTab.includes('list')) {
      fetchData(activeTab);
    }
    setFormData({});
    setErrors({});
  }, [activeTab, fetchData]);

  // HÀM XỬ LÝ THÊM MỚI (CREATE)
  const handleSubmit = (e) => {
    e.preventDefault();
    const category = activeTab.split('-')[0];

    if (Object.keys(formData).length === 0) {
      setErrors({ all: "Vui lòng nhập đầy đủ thông tin!" });
      return;
    }

    const currentData = JSON.parse(localStorage.getItem(`hb_${category}`)) || [];
    const newItem = { 
      id: Date.now(), // Tạo ID tự động dựa trên thời gian
      ...formData 
    };

    const updatedData = [newItem, ...currentData];
    localStorage.setItem(`hb_${category}`, JSON.stringify(updatedData));
    
    alert("Thêm thành công vào hệ thống!");
    setFormData({});
    const listTab = `${category}-list`;
    setActiveTab(listTab);
    fetchData(listTab);
  };

  // HÀM XỬ LÝ XÓA (DELETE)
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa mục này?")) {
      const category = activeTab.split('-')[0];
      const currentData = JSON.parse(localStorage.getItem(`hb_${category}`)) || [];
      const updatedData = currentData.filter(item => item.id !== id);
      
      localStorage.setItem(`hb_${category}`, JSON.stringify(updatedData));
      fetchData(activeTab);
    }
  };

  // HÀM XỬ LÝ CẬP NHẬT (UPDATE)
  const handleUpdate = (item) => {
    const category = activeTab.split('-')[0];
    const oldValue = item.username || item.title || item.review;
    const newValue = prompt("Nhập giá trị thay đổi:", oldValue);

    if (newValue && newValue !== oldValue) {
      const currentData = JSON.parse(localStorage.getItem(`hb_${category}`)) || [];
      const updatedData = currentData.map(val => {
        if (val.id === item.id) {
          if (category === 'auth') return { ...val, username: newValue };
          if (category === 'book') return { ...val, title: newValue };
          if (category === 'review') return { ...val, review: newValue };
        }
        return val;
      });

      localStorage.setItem(`hb_${category}`, JSON.stringify(updatedData));
      fetchData(activeTab);
      alert("Đã cập nhật thành công!");
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
            <div onClick={() => setActiveTab(`${id}-list`)} style={{ cursor: 'pointer', padding: '10px', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: activeTab === `${id}-list` ? '#34495e' : '', borderRadius: '4px' }}>
              <List size={14}/> List
            </div>
            <div onClick={() => setActiveTab(`${id}-create`)} style={{ cursor: 'pointer', padding: '10px', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: activeTab === `${id}-create` ? '#34495e' : '', borderRadius: '4px' }}>
              <PlusCircle size={14}/> Create
            </div>
          </div>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: '40px' }}>
        <h1 style={{ marginBottom: '20px' }}>{activeTab.toUpperCase().replace('-', ' > ')}</h1>
        
        {activeTab.includes('list') ? (
          <div style={{ overflowX: 'auto', background: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#ecf0f1' }}>
                  <th style={styles.th}>ID</th>
                  {data.length > 0 && Object.keys(data[0]).filter(k => k !== 'id').map(k => <th key={k} style={styles.th}>{k.toUpperCase()}</th>)}
                  <th style={{ ...styles.th, textAlign: 'center' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={styles.td}>{String(item.id).slice(-4)}</td> {/* Hiển thị 4 số cuối ID cho đẹp */}
                    {Object.entries(item).filter(([k]) => k !== 'id').map(([k, v], j) => <td key={j} style={styles.td}>{v}</td>)}
                    <td style={{ textAlign: 'center' }}>
                      <button onClick={() => handleUpdate(item)} style={styles.btn} title="Sửa"><Pencil size={14} color="#f1c40f"/></button>
                      <button onClick={() => handleDelete(item.id)} style={styles.btn} title="Xóa"><Trash2 size={14} color="#e74c3c"/></button>
                    </td>
                  </tr>
                ))}
                {data.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Chưa có dữ liệu</td></tr>}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '400px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {activeTab === 'auth-create' && (
                <input placeholder="Author Name" style={styles.input} value={formData.username || ''} onChange={e => setFormData({...formData, username: e.target.value})} />
              )}
              {activeTab === 'book-create' && (
                <>
                  <input placeholder="Title" style={styles.input} value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
                  <input placeholder="Author" style={styles.input} value={formData.author || ''} onChange={e => setFormData({...formData, author: e.target.value})} />
                </>
              )}
              {activeTab === 'review-create' && (
                <>
                  <input placeholder="Book Name" style={styles.input} value={formData.book || ''} onChange={e => setFormData({...formData, book: e.target.value})} />
                  <textarea placeholder="Review" style={{...styles.input, height: '100px'}} value={formData.review || ''} onChange={e => setFormData({...formData, review: e.target.value})} />
                </>
              )}
              {errors.all && <span style={{ color: 'red', fontSize: '14px' }}>{errors.all}</span>}
              <button type="submit" style={{ padding: '12px', background: '#27ae60', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>Create</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  th: { padding: '15px', textAlign: 'left', color: '#7f8c8d', fontSize: '13px' },
  td: { padding: '15px', color: '#2c3e50' },
  btn: { border: 'none', background: 'none', cursor: 'pointer', margin: '0 5px', padding: '5px' },
  input: { padding: '12px', border: '1px solid #ddd', borderRadius: '4px', outline: 'none' }
};

export default App;