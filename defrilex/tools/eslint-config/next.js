module.exports = {
  extends: [
    "./react.js",
    "next/core-web-vitals",
  ],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "@next/next/no-img-element": "warn",
    "@next/next/no-page-custom-font": "off",
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
    },
  ],
};
