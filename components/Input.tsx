import {
    StyleProp,
    StyleSheet,
    TextInput,
    View,
    ViewStyle,
  } from "react-native";
  import React from "react";
  import { hp } from "@/helpers/common";
  import { theme } from "@/constants/theme";
  
  interface InputProps extends React.ComponentProps<typeof TextInput> {
    containerStyle?: StyleProp<ViewStyle>;
    icon?: React.ReactNode;
    inputRef?: React.RefObject<TextInput>;
  }
  
  const Input = ({
    containerStyle,
    icon,
    inputRef,
    ...rest
  }: InputProps) => {
    return (
      <View style={[styles.container, containerStyle]}>
        {icon && <View >{icon}</View>}
        <TextInput
          ref={inputRef}
          style={styles.input}
          {...rest} 
        />
      </View>
    );
  };
  
  export default Input;
  
  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      height: hp(7.2),
      alignItems: "center",
      justifyContent: "flex-start",
      borderWidth: 0.4,
      borderColor: theme.colors.text,
      borderRadius: theme.radius.xxl,
      paddingHorizontal: 18,
      gap: 12,
    },
    input: {
    },
  });
  