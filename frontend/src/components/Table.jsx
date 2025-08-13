import React from "react";
export default function Table({ columns, data, renderRow }) {
  return (
    <div className="overflow-x-auto rounded-xl shadow bg-white border border-gray-100">
      <table className="min-w-full">
        <thead>
          <tr className="bg-green-50">
            {columns.map(col => (
              <th
                key={col.key}
                className={`py-3 px-4 text-left font-semibold text-green-800 text-sm border-b border-green-100 ${col.className || ""}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-6 text-center text-gray-400 font-medium">
                No data found.
              </td>
            </tr>
          ) : (
            data.map((row, i) =>
              // Alternate row color for readability
              <React.Fragment key={row._id || i}>
                {React.cloneElement(renderRow(row), {
                  className:
                    (i % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50") +
                    " hover:bg-green-50 transition " +
                    (renderRow(row).props.className || "")
                })}
              </React.Fragment>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}