import { StyleSheet, Text, View, TextInput } from "react-native";
import React, { useRef, useState } from "react";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import { theme } from "@/constants/theme";
interface RichTextEditorProps {
  editorRef: React.RefObject<RichEditor>;
  onChange: (body: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  editorRef,
  onChange,
}) => {
  return (
    <View style={{ minHeight: 285 }}>
      <RichToolbar
        actions={[
          actions.setStrikethrough,
          actions.removeFormat,
          actions.setBold,
          actions.setItalic,
          actions.insertOrderedList,
          actions.blockquote,
          actions.alignLeft,
          actions.alignRight,
          actions.code,
          actions.line,
          actions.heading1,
          actions.heading4,
        ]}
        iconMap={{
          [actions.heading1]: ({ tintColor }: any) => (
            <Text style={{ color: `${tintColor}` }}>H1</Text>
          ),
          [actions.heading4]: ({ tintColor }: any) => (
            <Text style={{ color: `${tintColor}` }}>H4</Text>
          ),
        }}
        selectedIconColor={theme.colors.primaryDark}
        style={styles.richBar}
        flatContainerStyle={styles.flatStyle}
        editor={editorRef}
        disabled={false}
      />
      <RichEditor
        ref={editorRef}
        containerStyle={styles.rich}
        editorStyle={styles.contentStyle}
        placeholder="Whats on your mind?"
        onChange={onChange}
      />

    
    </View>
  );
};

const styles = StyleSheet.create({
  richBar: {
    borderTopRightRadius: theme.radius.xl,
    borderTopLeftRadius: theme.radius.xl,
    backgroundColor: theme.colors.gray,
  },
  rich: {
    minHeight: 240,
    flex: 1,
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderBottomLeftRadius: theme.radius.xl,
    borderBottomRightRadius: theme.radius.xl,
    borderColor: theme.colors.gray,
    padding: 5,
  },
  contentStyle: {
    color: theme.colors.textLight,
    placeholderColor: "gray",
  },
  flatStyle: {
    paddingHorizontal: 8,
    gap:3
  },
});

export default RichTextEditor;
