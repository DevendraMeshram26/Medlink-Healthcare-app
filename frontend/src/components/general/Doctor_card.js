import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Icon } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../config/theme";

/**
 * Doctor card component shown in lists.
 * Displays doctor's photo, name, specialization, and availability.
 */
const Doctor_card = ({ name, specialization, id, image }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => navigation.navigate("DoctorInfo", { Itemid: id })}
      key={id}
    >
      <Image
        source={{
          uri:
            image ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRECWxY9RPTChUABfN3UAc73uSH6Gh2eiwewQ&usqp=CAU",
        }}
        style={styles.avatar}
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {name || "Doctor Name"}
        </Text>
        <Text style={styles.specialization} numberOfLines={1}>
          {specialization || "General Physician"}
        </Text>
        <View style={styles.timeRow}>
          <Icon source="clock-outline" size={14} color={theme.colors.textMuted} />
          <Text style={styles.timeText}>Mon - Fri</Text>
        </View>
      </View>
      <Icon source="chevron-right" size={22} color={theme.colors.textMuted} />
    </TouchableOpacity>
  );
};

export default Doctor_card;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.radii.lg,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: theme.radii.lg,
    backgroundColor: "#E2E8F0",
  },
  info: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  name: {
    fontFamily: theme.typography.fontFamilies.semiBold,
    fontSize: theme.typography.sizes.base,
    color: theme.colors.textPrimary,
  },
  specialization: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
    marginTop: 2,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.spacing.xs,
    gap: 4,
  },
  timeText: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textMuted,
  },
});