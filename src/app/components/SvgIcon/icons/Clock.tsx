import { memo } from "react";

export const Clock = memo(function Clock() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.8 13.2001H12C11.3376 13.2001 10.8 12.6637 10.8 12.0001V7.20012C10.8 6.53652 11.3376 6.00012 12 6.00012C12.6624 6.00012 13.2 6.53652 13.2 7.20012V10.8001H16.8C17.4636 10.8001 18 11.3365 18 12.0001C18 12.6637 17.4636 13.2001 16.8 13.2001ZM12 0C5.3832 0 0 5.3832 0 12C0 18.6168 5.3832 24 12 24C18.6168 24 24 18.6168 24 12C24 5.3832 18.6168 0 12 0Z"
        fill="currentColor"
      />
    </svg>
  );
});
