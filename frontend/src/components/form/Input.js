import React from "react";
import { TextInput } from "react-native-paper";
import { theme } from "../../config/theme";

/**
 * Styled text input using the app's design system.
 * Uses teal outline color and Inter font for consistency.
 *
 * @param {Object} props
 * @param {string} props.label - Placeholder/label text.
 * @param {Function} props.setValue - State setter for the input value.
 * @param {boolean} [props.secureTextEntry] - Hide text for passwords.
 * @param {string} [props.keyboardType] - Keyboard type (email, numeric, etc.)
 * @param {number} [props.numberOfLines] - Number of lines for multiline inputs.
 * @param {boolean} [props.multiline] - Enable multiline input.
 * @param {string} [props.value] - Current input value.
 * @param {string} [props.autoComplete] - Auto-complete hint.
 * @param {boolean} [props.editable] - Whether the input is editable.
 */
const Input = ({
  label,
  setValue,
  secureTextEntry,
  keyboardType,
  numberOfLines,
  multiline,
  value,
  autoComplete,
  editable,
}) => {
  return (
    <TextInput
      label={label}
      mode="outlined"
      style={{
        marginHorizontal: theme.spacing.lg,
        marginVertical: theme.spacing.sm,
        fontFamily: theme.typography.fontFamilies.regular,
        fontSize: theme.typography.sizes.base,
        backgroundColor: theme.colors.surface,
      }}
      onChangeText={(text) => setValue(text)}
      outlineColor={theme.colors.textMuted}
      activeOutlineColor={theme.colors.primary}
      outlineStyle={{ borderRadius: theme.radii.md }}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      numberOfLines={numberOfLines}
      multiline={multiline}
      value={value}
      autoComplete={autoComplete}
      editable={editable}
    />
  );
};

export default Input;