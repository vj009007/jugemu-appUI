import { memo } from "react";

export const Cross = memo(function Cross() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.17854 4.99996L9.75604 1.42246C10.0819 1.09663 10.0819 0.569964 9.75604 0.244131C9.43021 -0.0817025 8.90354 -0.0817025 8.57771 0.244131L5.00021 3.82163L1.42271 0.244131C1.09688 -0.0817025 0.570208 -0.0817025 0.244375 0.244131C-0.0814584 0.569964 -0.0814584 1.09663 0.244375 1.42246L3.82188 4.99996L0.244375 8.57747C-0.0814584 8.9033 -0.0814584 9.42996 0.244375 9.7558C0.406875 9.9183 0.620208 9.99996 0.833542 9.99996C1.04688 9.99996 1.26021 9.9183 1.42271 9.7558L5.00021 6.1783L8.57771 9.7558C8.74021 9.9183 8.95354 9.99996 9.16688 9.99996C9.38021 9.99996 9.59354 9.9183 9.75604 9.7558C10.0819 9.42996 10.0819 8.9033 9.75604 8.57747L6.17854 4.99996Z"
        fill="currentColor"
      />
    </svg>
  );
});
