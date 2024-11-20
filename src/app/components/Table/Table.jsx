import React from "react";
import "./Table.scss";

const Table = ({ columns, data }) => {
  console.log("data : ", data);
  return (
    <div className="tablecomponent">
      <table>
        <thead>
          <tr>
            <th>Sl. No.</th>
            {columns.map((column) => (
              <th key={column.key}>{column.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) && data.length > 0 ? (
            data.map((item, index) => (
              <tr key={item.id || index}>
                <td>{index + 1}</td>
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.render
                      ? column.render(item[column.dataIndex], item)
                      : item[column.dataIndex]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1}>No data found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
