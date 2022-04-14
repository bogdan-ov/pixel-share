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
    "ellipse": <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="13" cy="7" r="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M13 5.27557C12.2433 2.80236 9.90085 1 7.12844 1C3.7438 1 1 3.68629 1 7C1 10.3137 3.7438 13 7.12844 13C9.90085 13 12.2433 11.1976 13 8.72443" stroke="currentColor" strokeWidth="2"/>
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
    "view-grid": <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="1" y="10" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="10" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="10" y="10" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="2"/>
    </svg>,
    "view-list": <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="14" height="5" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="1" y="10" width="14" height="5" rx="1" stroke="currentColor" strokeWidth="2"/>
    </svg>,
    "view-short-list": <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="14" height="4" rx="1" stroke="currentColor" strokeWidth="2"/>
        <path d="M15 13V14C15 14.5523 14.5523 15 14 15H2C1.44772 15 1 14.5523 1 14V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M15 8V9C15 9.55228 14.5523 10 14 10H2C1.44772 10 1 9.55228 1 9V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
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
    "open": <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 8V1M7 1L10 4.11111M7 1L4 4.11111" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M1 8V9C1 11.2091 2.79086 13 5 13H9C11.2091 13 13 11.2091 13 9V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,    
    "undo": <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.999999 6L10 6C11.6569 6 13 7.34315 13 9L13 11M0.999999 6L6.33333 0.999999M0.999999 6L6.33333 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    "redo": <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 6.85785L4 6.85785C2.34315 6.85785 1 8.20099 1 9.85785L1 11.8578M13 6.85785L7.66667 1.85785M13 6.85785L7.66667 11.8578" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    "file": <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 5C1 2.79086 2.79086 1 5 1H8.17157C8.70201 1 9.21071 1.21071 9.58579 1.58579L13.4142 5.41421C13.7893 5.78929 14 6.29799 14 6.82843V11C14 13.2091 12.2091 15 10 15H5C2.79086 15 1 13.2091 1 11V5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M8 1V5C8 6.10457 8.89543 7 10 7H14" stroke="currentColor" strokeWidth="2"/>
    </svg>,
    "file-export": <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 15H5C2.79086 15 1 13.2091 1 11V5C1 2.79086 2.79086 1 5 1H8.17157C8.70201 1 9.21071 1.21071 9.58579 1.58579L11 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 1V4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8 10H15M15 10L11.8889 7M15 10L11.8889 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    "image": <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M1.5 12.5L3.9106 9.78808C4.7387 8.85647 6.20797 8.90105 6.97805 9.88116L11 15" stroke="currentColor" strokeWidth="2"/>
        <circle cx="10" cy="6" r="2" fill="currentColor"/>
    </svg>,
    "keep": <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5H6.00001" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <rect x="1" y="9" width="8" height="16" rx="4" transform="rotate(-90 1.00001 9)" stroke="currentColor" strokeWidth="2"/>
    </svg>,
    "not-keep": <svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="9" width="8" height="16" rx="4" transform="rotate(-90 1 9)" stroke="currentColor" strokeWidth="2"/>
    </svg>,
    "menu-bars": <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1H9M1 6H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>,
    "trash": <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.625 5.71228H12.375M3.625 5.71228L4.27537 13.6928C4.40228 15.25 5.70309 16.4491 7.26546 16.4491H8.73454C10.2969 16.4491 11.5977 15.25 11.7246 13.6928L12.375 5.71228M3.625 5.71228H1.875M12.375 5.71228H14.125" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M6.25 1.89473H9.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>,
    "arrow-top-left": <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.799 10.0208L1.31372 1.53554M1.31372 1.53554L1.54942 8.84231M1.31372 1.53554L8.62049 1.77125" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    "arrow-top-center": <svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.55637 13.9203L6.55636 1.92035M6.55636 1.92035L1.55636 7.25368M6.55636 1.92035L11.5564 7.25368" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    "arrow-top-right": <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.53554 10.0208L10.0208 1.53552M10.0208 1.53552L2.71405 1.77122M10.0208 1.53552L9.78512 8.84229" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    "arrow-center-left": <svg width="15" height="13" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.7782 6.77817L1.77817 6.77817M1.77817 6.77817L7.1115 11.7782M1.77817 6.77817L7.1115 1.77817" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    "arrow-center-center": <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="4" cy="4" r="3" stroke="currentColor" strokeWidth="2"/>
    </svg>,
    "arrow-center-right": <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 6.7782L13 6.7782M13 6.7782L7.66667 1.7782M13 6.7782L7.66667 11.7782" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    "arrow-bottom-left": <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.2426 1.53553L1.75735 10.0208M1.75735 10.0208L9.06411 9.78511M1.75735 10.0208L1.99305 2.71405" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    "arrow-bottom-center": <svg width="13" height="15" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.7782 1.77817L6.7782 13.7782M6.7782 13.7782L11.7782 8.44484M6.7782 13.7782L1.7782 8.44484" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    "arrow-bottom-right": <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.75737 1.75737L10.2426 10.2427M10.2426 10.2427L10.0069 2.93589M10.2426 10.2427L2.93588 10.007" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    "grid": <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 1V14M4 1V14M1 4H14M1 11H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>,
    "menu-dots": <svg width="2" height="7" viewBox="0 0 2 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="1" cy="1" r="1" fill="currentColor"/>
        <circle cx="1" cy="6" r="1" fill="currentColor"/>
    </svg>,
    "modification": <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.5493 1.91461C7.84934 0.994754 9.15066 0.994754 9.4507 1.91461L10.5176 5.18549C10.6518 5.59696 11.0355 5.87539 11.4683 5.87539H14.9126C15.8823 5.87539 16.2844 7.11698 15.4989 7.68549L12.7191 9.69731C12.3673 9.95195 12.22 10.4046 12.3547 10.8175L13.4181 14.0775C13.7184 14.9982 12.6655 15.7655 11.8811 15.1977L9.08629 13.1751C8.73644 12.9219 8.26357 12.9219 7.91371 13.1751L5.11893 15.1977C4.33446 15.7655 3.28165 14.9982 3.58194 14.0775L4.64531 10.8175C4.78 10.4046 4.63275 9.95195 4.2809 9.69731L1.50109 7.68549C0.715561 7.11698 1.11772 5.87539 2.08738 5.87539H5.53169C5.96449 5.87539 6.34817 5.59696 6.48239 5.18549L7.5493 1.91461Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>,
    "checkbox": <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect opacity="0.1" x="1" y="1" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M2 5.2L4.85714 8L12 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    "add-color": <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 5C6.44772 5 6 5.44772 6 6C6 6.55228 6.44772 7 7 7V5ZM17 7C17.5523 7 18 6.55228 18 6C18 5.44772 17.5523 5 17 5V7ZM13 1C13 0.447715 12.5523 0 12 0C11.4477 0 11 0.447715 11 1H13ZM11 11C11 11.5523 11.4477 12 12 12C12.5523 12 13 11.5523 13 11H11ZM7 7H12V5H7V7ZM12 7H17V5H12V7ZM13 6V1H11V6H13ZM11 6V11H13V6H11Z" fill="currentColor"/>
        <path d="M7 1H6C3.23858 1 1 3.23858 1 6V6C1 8.76142 3.23858 11 6 11H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>,
    "delete-color": <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 1L12 5M16 9L12 5M12 5L16 1M12 5L8 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M7 5H6.75C3.85051 5 1.5 7.35051 1.5 10.25V10.25C1.5 13.1495 3.85051 15.5 6.75 15.5V15.5C9.64949 15.5 12 13.1495 12 10.25V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>,
    "duplicate-color": <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.53553 14.5355C9.07124 14.9998 8.52004 15.3681 7.91342 15.6194C7.30679 15.8707 6.65661 16 6 16C5.34339 16 4.69321 15.8707 4.08658 15.6194C3.47995 15.3681 2.92876 14.9998 2.46447 14.5355C2.00017 14.0712 1.63188 13.52 1.3806 12.9134C1.12933 12.3068 1 11.6566 1 11C1 10.3434 1.12933 9.69321 1.3806 9.08658C1.63188 8.47995 2.00017 7.92876 2.46447 7.46447" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="11" cy="6" r="5" stroke="currentColor" strokeWidth="2"/>
    </svg>,
};

const Icon: React.FC<{ icon: keyof typeof icons }> = ({ icon })=>
    icons[icon] || icon;

export default Icon;