// Build with WITH_WORKAROUND=1 to apply the style workaround and compare.
module.exports = ({ config }) => ({
  ...config,
  plugins: [...(config.plugins ?? []), ...(process.env.WITH_WORKAROUND === '1' ? ['./plugins/withHeaderKeyboardFocus'] : [])],
});
