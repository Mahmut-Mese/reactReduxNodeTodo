// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Suppress third-party library warnings in tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Support for defaultProps will be removed') ||
       args[0].includes('Warning: Received') ||
       args[0].includes('for a non-boolean attribute') ||
       args[0].includes('Warning:') ||
       args[0].includes('DeprecationWarning') ||
       args[0].includes('autoprefixer') ||
       args[0].includes('color-adjust'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('React Router Future Flag Warning') ||
       args[0].includes('Warning:') ||
       args[0].includes('DeprecationWarning') ||
       args[0].includes('autoprefixer') ||
       args[0].includes('color-adjust') ||
       args[0].includes('browserslist'))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
