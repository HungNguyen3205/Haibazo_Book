//import React from 'react';

const DataTable = ({ data, columns, onDelete, onUpdate }) => {
  return (
    <div className="content-container">
      <table className="haibazo-table">
        <thead>
          <tr>
            <th>No</th>
            {columns.map(col => <th key={col.key}>{col.label}</th>)}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              {columns.map(col => <td key={col.key}>{item[col.key]}</td>)}
              <td className="actions-cell">
                <button className="btn-yellow" onClick={() => onUpdate(item)}>U</button>
                <button className="btn-yellow" onClick={() => onDelete(item.id)}>D</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button>1</button><button>2</button><button>3</button><span>...</span>
      </div>
    </div>
  );
};

export default DataTable;