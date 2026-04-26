const Sidebar = ({ activeTab, setActiveTab }) => {
  const menus = [
    { id: 'authors', label: 'Authors' },
    { id: 'books', label: 'Books' },
    { id: 'reviews', label: 'Reviews' }
  ];

  return (
    <div className="sidebar">
      <h2>HAIBAZO BOOK</h2>
      {menus.map(menu => (
        <div key={menu.id} className="menu-group">
          <div className="menu-header">
            <span className="icon-yellow"></span> {menu.label}
          </div>
          <ul className="submenu">
            <li 
              className={activeTab === `${menu.id}-list` ? 'active' : ''} 
              onClick={() => setActiveTab(`${menu.id}-list`)}
            >List</li>
            <li 
              className={activeTab === `${menu.id}-create` ? 'active' : ''} 
              onClick={() => setActiveTab(`${menu.id}-create`)}
            >Create</li>
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;