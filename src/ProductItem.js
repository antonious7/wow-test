import React from "react";

export function ProductItem({ productData, formatNumber }) {
  return (
    <>
      {productData.map((b, key) => (
        <tr key={b.name}>
          <td>{b.name}</td>
          <td>{formatNumber(b.unitPrice * b.sold)}</td>
        </tr>
      ))}
    </>
  );
}
