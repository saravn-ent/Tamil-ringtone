module.exports = {
  plugins: [
    ["postcss-import",{}],
    ["@tailwindcss/postcss", {}],
    ["postcss-preset-env",{
      browsers: "last 2 versions"
    }],
    ["postcss-custom-media",{}],
    ["autoprefixer",{}]
  ]
};
