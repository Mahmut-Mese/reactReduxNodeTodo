declare module 'jwt-decode' {
  function decode<T = any>(token: string): T;
  export default decode;
}
