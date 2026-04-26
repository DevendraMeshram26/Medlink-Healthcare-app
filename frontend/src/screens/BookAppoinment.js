import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import React, { useContext, useState } from "react";
import Input from "../components/form/Input";
import DateTimePicker from "@react-native-community/datetimepicker";
import BookingSuccessModal from "../components/general/BookingSuccessModal";
import { AuthContext } from "../state/AuthContext";
import CustomButton from "../components/form/CustomButton";
import axios from "axios";
import { theme } from "../config/theme";

/**
 * Book Appointment screen — enter name, pick a date, and book.
 */
const BookAppoinment = ({ route }) => {
  const { doctorId } = route.params;
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isBookingSuccessful, setIsBookingSuccessful] = useState(false);
  const [name, setName] = useState("");
  const { authState } = useContext(AuthContext);

  const BookingHandler = async () => {
    try {
      if (!name) {
        alert("Please enter your name.");
        return;
      }

      const payload = {
        name,
        userId: authState.Userid,
        doctorId,
        timing: date,
      };
      const { data } = await axios.post("/booking", payload);

      if (data.success) {
        setIsBookingSuccessful(true);
        setName("");
        setDate(new Date());
      }
    } catch (error) {
      alert("Failed to book appointment. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setIsBookingSuccessful(false);
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const onChange = (event, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
      if (Platform.OS === "android") {
        toggleDatePicker();
      }
    } else {
      toggleDatePicker();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.headerBlock}>
          <Text style={styles.pageTitle}>Book Appointment</Text>
          <Text style={styles.pageSubtitle}>
            Fill in your details to schedule a visit
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          <Input label="Your Name" value={name} setValue={setName} />

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="spinner"
              onChange={onChange}
            />
          )}

          <Pressable onPress={toggleDatePicker}>
            <Input
              label="Appointment Date"
              editable={false}
              value={date ? date.toDateString() : ""}
            />
          </Pressable>
        </View>

        {/* Book Button */}
        <CustomButton label="Confirm Booking" onPress={BookingHandler} />
      </View>

      <BookingSuccessModal
        isVisible={isBookingSuccessful}
        onClose={handleCloseModal}
      />
    </SafeAreaView>
  );
};

export default BookAppoinment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    gap: theme.spacing.xl,
  },
  headerBlock: {
    paddingHorizontal: theme.spacing.lg,
  },
  pageTitle: {
    fontFamily: theme.typography.fontFamilies.bold,
    fontSize: theme.typography.sizes.xxxl,
    color: theme.colors.textPrimary,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontFamily: theme.typography.fontFamilies.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.xs,
  },
  formCard: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radii.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});
