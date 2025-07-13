import { StyleSheet } from "react-native";
import styled from "styled-components/native";
import NavigationScrollView from "./NavigationScrollView";

const styles = StyleSheet.create({
  root: { paddingTop: 16, paddingBottom: 64 },
});

const SettingsNavigationScrollView = styled(NavigationScrollView).attrs({
  contentContainerStyle: styles.root,
})``;

export default SettingsNavigationScrollView; 