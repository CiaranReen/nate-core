module.exports = {
  extends: ["@nate/eslint-config"],
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  rules: {
    // Add any package-specific rules here
  },
};
