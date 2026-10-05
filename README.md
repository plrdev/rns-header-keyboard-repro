# react-native-screens: Android native stack header is unreachable with an external keyboard

Minimal Expo (managed / CNG) reproduction. On Android, with a hardware keyboard, Tab and
Shift+Tab never reach anything in the native stack header: not the back button, not a
`headerRight` view. TalkBack can reach them (it uses accessibility focus, not keyboard focus).

- react-native-screens 4.28.0
- @react-navigation/native-stack 7.x
- react-native 0.86.3, Expo SDK 57
- Tested on an Android 15 emulator (touchscreen device)

## Run

```bash
npm install
npx expo run:android
```

1. On the Home screen, tap **Open Details**.
2. Attach a keyboard. On an emulator, the host keyboard works, or use
   `adb shell input keyboard keyevent KEYCODE_TAB`.
3. Press Tab repeatedly. The focused button gets a red border, and "Keyboard focus" shows its name.

**Actual:** focus cycles Content button 1 → Content button 2 → Content button 1 … The back
button and **Header action** are never focused.

**Expected:** Tab also reaches the back button and **Header action**, and Enter activates them.

## Cause

`ScreenStackFragment` creates an `AppBarLayout` with `CustomToolbar` inside it, using the theme's
default styles. Both default styles (Material `Widget.Design.AppBarLayout`, AppCompat
`Base.V26.Widget.AppCompat.Toolbar`) set `android:touchscreenBlocksFocus="true"` (and
`android:keyboardNavigationCluster="true"`). On a touchscreen device that keeps the header's
children out of key navigation. The only remaining way in is cluster navigation (Meta+Tab),
which the system takes for itself on recent Android versions (Recents on Android 15,
app switching on Samsung).

## Workaround (to compare)

```bash
WITH_WORKAROUND=1 npx expo prebuild --platform android --clean
WITH_WORKAROUND=1 npx expo run:android
```

[`plugins/withHeaderKeyboardFocus.js`](plugins/withHeaderKeyboardFocus.js) sets
`android:touchscreenBlocksFocus=false` on both default styles. Tab then goes Content button 1 →
Content button 2 → back button → Header action, and Enter activates Header action.

What we found:

| Override | Header reachable with Tab |
| --- | --- |
| none | no |
| Toolbar style only | no |
| AppBarLayout style only | no |
| `touchscreenBlocksFocus=false` on both (`keyboardNavigationCluster` unchanged) | yes |

So a fix in the library could be setting `touchscreenBlocksFocus = false` on the `AppBarLayout`
in `ScreenStackFragment` and in `CustomToolbar`.
