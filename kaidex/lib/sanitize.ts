import DOMPurify from 'isomorphic-dompurify';
export function sanitizeInput(input: string): string { if (!input) return ''; return DOMPurify.sanitize(input.trim()); }
export function validateEmail(email: string): boolean { return /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/.test(email); }
