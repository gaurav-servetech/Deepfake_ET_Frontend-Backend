/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';

const DocumentationTable = ({ title, listItems }) => {
  if (!listItems || listItems.length === 0) return null;

  return (
    <div className='doc-table-container'>
      {title && <p className="doc-table-title">{title}</p>}
      <table className="doc-table">
        <thead>
          <tr>
            <th style={{ width: '30%' }}>Type/Step</th>
            <th style={{ width: '70%' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {listItems.map((item, index) => (
            <tr key={index}>
              <td className="doc-table-type">{item.title}</td>
              <td className="doc-table-details">{item.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentationTable;