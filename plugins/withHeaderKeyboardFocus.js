const { AndroidConfig, withAndroidStyles } = require('expo/config-plugins');

/**
 * Workaround: set android:touchscreenBlocksFocus=false on the default Toolbar and
 * AppBarLayout styles, which the native stack header inherits. Both are needed;
 * keyboardNavigationCluster can stay as it is.
 * Enabled only when building with WITH_WORKAROUND=1 (see app.config.js).
 */
module.exports = function withHeaderKeyboardFocus(config) {
  return withAndroidStyles(config, (config) => {
    let xml = config.modResults;

    const styles = [
      ['toolbarStyle', 'Widget.Repro.Toolbar', 'Widget.AppCompat.Toolbar'],
      ['appBarLayoutStyle', 'Widget.Repro.AppBarLayout', 'Widget.Design.AppBarLayout'],
    ];

    for (const [themeAttr, styleName, styleParent] of styles) {
      xml = AndroidConfig.Styles.assignStylesValue(xml, {
        add: true,
        parent: { name: styleName, parent: styleParent },
        name: 'android:touchscreenBlocksFocus',
        value: 'false',
      });
      xml = AndroidConfig.Styles.assignStylesValue(xml, {
        add: true,
        parent: AndroidConfig.Styles.getAppThemeGroup(),
        name: themeAttr,
        value: `@style/${styleName}`,
      });
    }

    config.modResults = xml;
    return config;
  });
};
