import React, { ReactNode } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  Animated,
  PanResponder,
  Dimensions,
} from "react-native";
import { useTheme } from "styled-components/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Flex, Text, Icons } from "@ledgerhq/native-ui";

const { height: screenHeight } = Dimensions.get("window");

export interface Props {
  isRequestingToBeOpened: boolean;
  onClose?: () => void;
  onModalHide?: () => void;
  children?: ReactNode;
  title?: string;
  description?: string;
  preventBackdropClick?: boolean;
  noCloseButton?: boolean;
  style?: any;
}

const QueuedDrawer: React.FC<Props> = ({
  isRequestingToBeOpened,
  onClose,
  onModalHide,
  children,
  title,
  description,
  preventBackdropClick = false,
  noCloseButton = false,
  style,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const handleBackdropPress = () => {
    if (!preventBackdropClick && onClose) {
      onClose();
    }
  };

  const handleModalHide = () => {
    if (onModalHide) onModalHide();
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={isRequestingToBeOpened}
      onRequestClose={onClose}
      onDismiss={handleModalHide}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
        
        <SafeAreaView style={styles.safeArea}>
          <View 
            style={[
              styles.container,
              {
                backgroundColor: colors.background?.drawer || colors.background?.main || "#1A1A1A",
                paddingBottom: insets.bottom,
              },
              style,
            ]}
          >
            {/* Header */}
            {(title || !noCloseButton) && (
              <Flex
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                px={6}
                py={4}
                borderBottomWidth={title ? 1 : 0}
                borderBottomColor={colors.neutral?.c30 || "#333"}
              >
                {title && (
                  <Text variant="h4" fontWeight="semiBold" color="neutral.c100">
                    {title}
                  </Text>
                )}
                {!noCloseButton && (
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Icons.Close size="M" color={colors.neutral?.c70 || "#666"} />
                  </TouchableOpacity>
                )}
              </Flex>
            )}

            {/* Description */}
            {description && (
              <Flex px={6} pt={4}>
                <Text variant="body" color="neutral.c70">
                  {description}
                </Text>
              </Flex>
            )}

            {/* Content */}
            <Flex flex={1} px={6} py={6}>
              {children}
            </Flex>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  safeArea: {
    maxHeight: screenHeight * 0.9,
  },
  container: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    minHeight: 200,
    maxHeight: "100%",
  },
  closeButton: {
    padding: 8,
  },
});

export default QueuedDrawer; 