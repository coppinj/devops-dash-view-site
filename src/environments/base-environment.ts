export const baseEnvironment = {
  defaultLanguage: 'fr',
  languages: ['fr'],
  defaults: {
    username: null,
    password: null,
  },
  jwtTokenKey: 'JWT_TOKEN_KEY',
  routes: {
    disallowedRoutesForJwt: [
      /\/public/,
      /\/login/,
    ],
  },
  debug: false,
};
