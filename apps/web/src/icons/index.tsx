import React from "react";

interface IconProps {
  className?: string;
}

export const ReceiptIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    width="16"
    height="20"
    viewBox="0 0 16 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.75 4.75H4.75M10.75 8.75H4.75M10.75 12.75H6.75M0.75 0.75H14.75V18.75L13.718 17.866C13.3555 17.5553 12.8939 17.3846 12.4165 17.3846C11.9391 17.3846 11.4775 17.5553 11.115 17.866L10.083 18.75L9.052 17.866C8.68946 17.5551 8.22761 17.3842 7.75 17.3842C7.27239 17.3842 6.81054 17.5551 6.448 17.866L5.417 18.75L4.385 17.866C4.02253 17.5553 3.56088 17.3846 3.0835 17.3846C2.60611 17.3846 2.14447 17.5553 1.782 17.866L0.75 18.75V0.75Z"
      stroke="#0D6363"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PencilIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    width="15"
    height="16"
    viewBox="0 0 15 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.8614 0.727933C12.6307 0.497089 12.3568 0.313982 12.0552 0.189078C11.7537 0.0641742 11.4305 -7.61342e-05 11.1041 6.77029e-08C10.7778 7.62696e-05 10.4546 0.0644775 10.1531 0.189522C9.85167 0.314566 9.57781 0.497802 9.3472 0.728753L1.54665 8.53997C1.08186 9.00583 0.820737 9.63696 0.820505 10.295V12.9231C0.820505 13.2628 1.0962 13.5385 1.43588 13.5385H4.08037C4.73924 13.5385 5.37103 13.2759 5.83626 12.8107L13.6311 5.01097C14.096 4.5449 14.3572 3.91343 14.3572 3.25509C14.3572 2.59674 14.096 1.96528 13.6311 1.49921L12.8614 0.727933ZM0.615379 14.7692C0.45217 14.7692 0.295646 14.8341 0.18024 14.9495C0.0648343 15.0649 0 15.2214 0 15.3846C0 15.5478 0.0648343 15.7044 0.18024 15.8198C0.295646 15.9352 0.45217 16 0.615379 16H13.7435C13.9067 16 14.0632 15.9352 14.1786 15.8198C14.294 15.7044 14.3588 15.5478 14.3588 15.3846C14.3588 15.2214 14.294 15.0649 14.1786 14.9495C14.0632 14.8341 13.9067 14.7692 13.7435 14.7692H0.615379Z"
      fill="#0D6363"
    />
  </svg>
);

export const HamburgerIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

export const MyLeadsIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
    />
  </svg>
);

export const ProfileIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

export const LogoutIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

export const ZipIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#0D6363"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const ProfessionIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    width="18"
    height="18"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_361_1053)">
      <path
        d="M7.33816 14.0003H6.4035C4.0135 14.0003 2.81883 14.0003 2.07616 13.2437C1.3335 12.487 1.3335 11.2697 1.3335 8.83366C1.3335 6.39833 1.3335 5.18033 2.07616 4.42366C2.81883 3.66699 4.0135 3.66699 6.4035 3.66699H8.93883C11.3288 3.66699 12.5242 3.66699 13.2668 4.42366C13.8382 5.00566 13.9695 5.86099 14.0002 7.33366"
        stroke="#0D6363"
        strokeWidth="1.28"
        strokeLinecap="round"
      />
      <path
        d="M13.3442 13.3495L14.6662 14.6675M14.0349 11.6849C14.0401 11.3728 13.9832 11.0628 13.8674 10.773C13.7516 10.4831 13.5793 10.2192 13.3604 9.99669C13.1416 9.77414 12.8807 9.59739 12.5928 9.47674C12.305 9.35608 11.996 9.29395 11.6839 9.29395C11.3717 9.29395 11.0627 9.35608 10.7749 9.47674C10.4871 9.59739 10.2261 9.77414 10.0073 9.99669C9.78844 10.2192 9.6161 10.4831 9.50031 10.773C9.38452 11.0628 9.3276 11.3728 9.33285 11.6849C9.34324 12.3015 9.5955 12.8894 10.0353 13.3219C10.475 13.7543 11.0671 13.9966 11.6839 13.9966C12.3006 13.9966 12.8927 13.7543 13.3324 13.3219C13.7722 12.8894 14.0245 12.3015 14.0349 11.6849Z"
        stroke="#0D6363"
        strokeWidth="1.28"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.667 3.66732L10.6003 3.46065C10.2703 2.43398 10.1057 1.92065 9.71299 1.62732C9.31966 1.33398 8.79833 1.33398 7.75366 1.33398H7.57833C6.53499 1.33398 6.01299 1.33398 5.62033 1.62732C5.22699 1.92065 5.06233 2.43398 4.73233 3.46065L4.66699 3.66732"
        stroke="#0D6363"
        strokeWidth="1.28"
      />
    </g>
    <defs>
      <clipPath id="clip0_361_1053">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const DollarIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#0D6363"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

export const AgeIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#0D6363"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export const CountyIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#0D6363"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const LeadTypeIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    width="20"
    height="17"
    viewBox="0 0 20 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.0703 8.86609H15.1126C14.8461 8.86609 14.5882 8.9025 14.3427 8.96945C13.8584 8.01742 12.8696 7.36328 11.7303 7.36328H8.26973C7.13039 7.36328 6.14164 8.01742 5.65734 8.96945C5.40645 8.90088 5.14752 8.86612 4.88742 8.86609H2.92969C1.31426 8.86609 0 10.1804 0 11.7958V14.9254C0 15.8946 0.788555 16.6832 1.75781 16.6832H18.2422C19.2114 16.6832 20 15.8946 20 14.9254V11.7958C20 10.1804 18.6857 8.86609 17.0703 8.86609ZM5.34004 10.293V15.5114H1.75781C1.43473 15.5114 1.17188 15.2485 1.17188 14.9254V11.7958C1.17188 10.8266 1.96043 10.038 2.92969 10.038H4.88742C5.04648 10.038 5.20051 10.0596 5.34715 10.0994C5.34265 10.1639 5.34028 10.2284 5.34004 10.293ZM13.4881 15.5114H6.51191V10.293C6.51191 9.32375 7.30047 8.5352 8.26973 8.5352H11.7303C12.6995 8.5352 13.4881 9.32375 13.4881 10.293V15.5114ZM18.8281 14.9254C18.8281 15.2485 18.5653 15.5114 18.2422 15.5114H14.66V10.293C14.6597 10.2284 14.6573 10.1638 14.6529 10.0994C14.8027 10.0586 14.9573 10.038 15.1126 10.038H17.0703C18.0396 10.038 18.8281 10.8265 18.8281 11.7958V14.9254Z"
      fill="#0D6363"
      stroke="#0D6363"
      strokeWidth="0.2"
    />
    <path
      d="M3.90829 3.33301C2.47278 3.33301 1.30493 4.50086 1.30493 5.93637C1.30489 7.37187 2.47278 8.53973 3.90829 8.53973C5.34376 8.53973 6.51165 7.37187 6.51165 5.93637C6.51165 4.50086 5.3438 3.33301 3.90829 3.33301ZM3.90825 7.36785C3.11892 7.36785 2.47677 6.7257 2.47677 5.93637C2.47677 5.14703 3.11892 4.50488 3.90825 4.50488C4.69759 4.50488 5.33974 5.14703 5.33974 5.93637C5.33974 6.7257 4.69759 7.36785 3.90825 7.36785ZM9.9997 0.0996094C8.08188 0.0996094 6.52165 1.65984 6.52165 3.57766C6.52165 5.49547 8.08188 7.0557 9.9997 7.0557C11.9175 7.0557 13.4777 5.49547 13.4777 3.57766C13.4777 1.65988 11.9175 0.0996094 9.9997 0.0996094ZM9.9997 5.88383C8.72806 5.88383 7.69352 4.8493 7.69352 3.57766C7.69352 2.30605 8.72806 1.27148 9.9997 1.27148C11.2713 1.27148 12.3059 2.30602 12.3059 3.57766C12.3059 4.8493 11.2713 5.88383 9.9997 5.88383ZM16.0911 3.33301C14.6556 3.33301 13.4877 4.50086 13.4877 5.93637C13.4878 7.37187 14.6556 8.53973 16.0911 8.53973C17.5266 8.53973 18.6945 7.37187 18.6945 5.93637C18.6945 4.50086 17.5266 3.33301 16.0911 3.33301ZM16.0911 7.36785C15.3018 7.36785 14.6596 6.7257 14.6596 5.93637C14.6597 5.14703 15.3018 4.50488 16.0911 4.50488C16.8804 4.50488 17.5226 5.14703 17.5226 5.93637C17.5226 6.7257 16.8804 7.36785 16.0911 7.36785Z"
      fill="#0D6363"
      stroke="#0D6363"
      strokeWidth="0.2"
    />
  </svg>
);

export const FilterIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="#333333"
    stroke="#333333"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

export const ChevronDownIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    width="12"
    height="6"
    viewBox="0 0 12 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.35301 5.66533C5.40652 5.71715 5.47814 5.75951 5.56167 5.78878C5.64521 5.81804 5.73817 5.83333 5.83254 5.83333C5.92692 5.83333 6.01987 5.81804 6.10341 5.78878C6.18695 5.75951 6.25856 5.71715 6.31208 5.66533L11.5625 0.610125C11.6233 0.551818 11.6589 0.483524 11.6655 0.412663C11.6722 0.341802 11.6495 0.271085 11.6001 0.208194C11.5507 0.145304 11.4763 0.0926458 11.3852 0.055941C11.294 0.0192362 11.1895 -0.000111348 11.083 4.82054e-07H0.582131C0.475865 0.000293065 0.371729 0.0198895 0.280922 0.0566822C0.190114 0.0934749 0.116072 0.146072 0.0667562 0.208817C0.0174408 0.271562 -0.00528143 0.342081 0.00103305 0.41279C0.00734752 0.483499 0.0424598 0.551723 0.102594 0.610125L5.35301 5.66533Z"
      fill="#333333"
    />
  </svg>
);

export const ArrowLeftIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
);

export const UsersIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

export const AlertCircleIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export const LoadingIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export const CartIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

export const LocateIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" />
    <line x1="12" y1="2" x2="12" y2="4" />
    <line x1="12" y1="20" x2="12" y2="22" />
    <line x1="2" y1="12" x2="4" y2="12" />
    <line x1="20" y1="12" x2="22" y2="12" />
  </svg>
);

export const XIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export const SearchIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);
