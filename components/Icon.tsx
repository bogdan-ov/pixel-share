import React from "react";

export const icons = {
    "pen": <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 4L9.58579 2.41421C10.3668 1.63316 11.6332 1.63316 12.4142 2.41421L14.5858 4.58579C15.3668 5.36683 15.3668 6.63317 14.5858 7.41421L13 9M8 4L1.58579 10.4142C1.21071 10.7893 1 11.298 1 11.8284V16H5.17157C5.70201 16 6.21071 15.7893 6.58579 15.4142L13 9M8 4L13 9" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>,
    "erase": <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 7L1.72506 11.2749C0.832629 12.1674 0.979751 13.6532 2.02988 14.3533L3 15H8L11 12M6 7L10.5858 2.41421C11.3668 1.63317 12.6332 1.63317 13.4142 2.41421L15.5858 4.58579C16.3668 5.36684 16.3668 6.63317 15.5858 7.41421L11 12M6 7L11 12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>,
    "selection": <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="14" height="14" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeDasharray="4 3" strokeDashoffset="2" />
    </svg>,
    "line": <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 12L11.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <circle cx="13" cy="3" r="2" stroke="currentColor" strokeWidth="2"/>
        <circle cx="3" cy="13" r="2" stroke="currentColor" strokeWidth="2"/>
    </svg>,
    "rectangle": <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.1667 3H5M14 4.83333V12M4.83333 14H12M3 12.1667V5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <circle cx="14" cy="3" r="2" stroke="currentColor" strokeWidth="2"/>
        <circle cx="14" cy="14" r="2" stroke="currentColor" strokeWidth="2"/>
        <circle cx="3" cy="3" r="2" stroke="currentColor" strokeWidth="2"/>
        <circle cx="3" cy="14" r="2" stroke="currentColor" strokeWidth="2"/>
    </svg>,
    "checkerboard": <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect y="4" width="4" height="4" rx="1" fill="currentColor"/>
        <rect y="12" width="4" height="4" rx="1" fill="currentColor"/>
        <rect x="4" width="4" height="4" rx="1" fill="currentColor"/>
        <rect x="4" width="4" height="4" rx="1" fill="currentColor"/>
        <rect x="4" y="8" width="4" height="4" rx="1" fill="currentColor"/>
        <rect x="8" y="4" width="4" height="4" rx="1" fill="currentColor"/>
        <rect x="8" y="12" width="4" height="4" rx="1" fill="currentColor"/>
        <rect x="12" width="4" height="4" rx="1" fill="currentColor"/>
        <rect x="12" width="4" height="4" rx="1" fill="currentColor"/>
        <rect x="12" y="8" width="4" height="4" rx="1" fill="currentColor"/>
    </svg>,
    "fill": <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="9" width="12" height="12" rx="2" transform="rotate(-45 1 9)" stroke="currentColor" strokeWidth="2"/>
    </svg>,

    "add": <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 7C0.447715 7 0 7.44772 0 8C0 8.55228 0.447715 9 1 9V7ZM15 9C15.5523 9 16 8.55228 16 8C16 7.44772 15.5523 7 15 7V9ZM9 1C9 0.447715 8.55228 0 8 0C7.44772 0 7 0.447715 7 1H9ZM7 15C7 15.5523 7.44772 16 8 16C8.55228 16 9 15.5523 9 15H7ZM1 9H8V7H1V9ZM8 9H15V7H8V9ZM9 8V1H7V8H9ZM7 8V15H9V8H7Z" fill="currentColor"/>
    </svg>,
    "checkmark": <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 7L5 11L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    "cross": <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L6 6M11 11L6 6M6 6L11 1M6 6L1 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>,
    "small-cross": <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L4 4M7 7L4 4M4 4L7 1M4 4L1 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>,
    "visible": <svg width="14" height="7" viewBox="0 0 14 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 5C2.19765 2.6088 4.43616 1 7 1C9.56384 1 11.8023 2.6088 13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="7" cy="4" r="3" fill="currentColor"/>
    </svg>,
    "hidden": <svg width="14" height="6" viewBox="0 0 14 6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1C2.19765 3.39121 4.43616 5 7 5C9.56384 5 11.8023 3.39121 13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    "unlock": <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="8" width="10" height="6" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M9 4.5V4C9 2.34315 7.65685 1 6 1V1C4.34315 1 3 2.34314 3 4V7.99999" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>,
    "lock": <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="6.5" width="10" height="6" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M9 6.49999V4.5C9 2.84315 7.65685 1.5 6 1.5V1.5C4.34315 1.5 3 2.84315 3 4.5V6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>,
    "delete-layer": <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 1L11 5M15 9L11 5M11 5L15 1M11 5L7 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M6 5H3C1.89543 5 1 5.89543 1 7V11C1 12.1046 1.89543 13 3 13H9C10.1046 13 11 12.1046 11 11V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>,
    "add-layer": <svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 5C5.44772 5 5 5.44772 5 6C5 6.55228 5.44772 7 6 7V5ZM16 7C16.5523 7 17 6.55228 17 6C17 5.44772 16.5523 5 16 5V7ZM12 1C12 0.447715 11.5523 0 11 0C10.4477 0 10 0.447715 10 1H12ZM10 11C10 11.5523 10.4477 12 11 12C11.5523 12 12 11.5523 12 11H10ZM6 7H11V5H6V7ZM11 7H16V5H11V7ZM12 6V1H10V6H12ZM10 6V11H12V6H10Z" fill="currentColor"/>
        <path d="M6 2H3C1.89543 2 1 2.89543 1 4V8C1 9.10457 1.89543 10 3 10H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>,
    "rename-layer": <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 11V8.49509C7 7.96466 7.21071 7.45595 7.58579 7.08088L12.2525 2.41421C13.0335 1.63316 14.2998 1.63317 15.0809 2.41421L15.5858 2.91912C16.3668 3.70017 16.3668 4.9665 15.5858 5.74755L10.9191 10.4142C10.544 10.7893 10.0353 11 9.50491 11H7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M10 15H3C1.89543 15 1 14.1046 1 13V9C1 7.89543 1.89543 7 3 7H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>,
    "grid-view": <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="1" y="10" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="10" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="10" y="10" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="2"/>
    </svg>,
    "list-view": <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="14" height="5" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="1" y="10" width="14" height="5" rx="1" stroke="currentColor" strokeWidth="2"/>
    </svg>,
    "arrow-down": <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    "arrow-up": <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 7L7 1L13 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    "small-arrow-down": <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    "small-arrow-up": <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 5L5 1L9 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    "save": <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 1V8M7 8L10 4.88889M7 8L4 4.88889" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M1 8V9C1 11.2091 2.79086 13 5 13H9C11.2091 13 13 11.2091 13 9V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    "load": <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 8V1M7 1L10 4.11111M7 1L4 4.11111" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M1 8V9C1 11.2091 2.79086 13 5 13H9C11.2091 13 13 11.2091 13 9V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>     
};

const Icon: React.FC<{ icon: keyof typeof icons }> = ({ icon })=>
    icons[icon] || icon;

export default Icon;