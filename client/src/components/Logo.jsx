import React from 'react';

const Logo = () => (
  <svg width="200" height="60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60">
    <path d="M15,5 H25 V15 H35 V25 H25 V35 H15 V25 H5 V15 H15 Z" fill="#27ae60"/>
    <path d="M20,10 C15,15 15,25 20,30 C25,25 25,15 20,10 Z" fill="#ffffff"/>
    <text x="45" y="28" font-family="Inter, sans-serif" font-weight="800" font-size="22" fill="#1b4332">Evergreen</text>
    <text x="45" y="48" font-family="Inter, sans-serif" font-weight="400" font-size="16" fill="#27ae60">Clinic | Highbury</text>
  </svg>
);

export default Logo;