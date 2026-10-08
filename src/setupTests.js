import '@testing-library/jest-dom';

// Mock CSS imports to prevent JSDOM parse errors
vi.mock('@toast-ui/editor/dist/toastui-editor.css', () => ({}));
vi.mock('@toast-ui/editor/dist/toastui-editor-viewer.css', () => ({}));
