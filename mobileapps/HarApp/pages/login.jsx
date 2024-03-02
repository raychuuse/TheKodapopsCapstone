import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";

// Import Components
import CustomModal from "../components/modal";

// Import Style Compontes
import { Title1, Body, Subhead } from "../components/typography";

const LogInPage = () => {
  const [email, setEmail] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={styles.page}>
      <CustomModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}>
        <View style={{ width: "100%", gap: 16 }}>
          <View style={{ marginBottom: 32, gap: 8 }}>
            <Title1>Reset Your Password</Title1>
            <Subhead>
              Enter the email address associated with your account, and we'll
              send you a link to reset your password.
            </Subhead>
          </View>
          <TextInput
            style={[styles.input, { backgroundColor: "rgb(230,230,230)" }]}
            placeholder="Please enter your email"
            keyboardType="email-address"
            inputMode="email"
            autoComplete="email"
            clearButtonMode="always"
            onChange={setResetEmail}
            value={resetEmail}
          />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.button_text}>Send Reset Link</Text>
          </TouchableOpacity>
        </View>
      </CustomModal>
      <View style={styles.body}>
        <Text style={styles.h1}>Welcome</Text>
        <TextInput
          style={styles.input}
          placeholder="Please enter your email"
          keyboardType="email-address"
          inputMode="email"
          autoComplete="email"
          clearButtonMode="always"
          onChange={setEmail}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          clearButtonMode="always"
          value={password}
          onChange={setPassword}
        />
        <View style={styles.button_container}>
          <Link href="/dashboard/setup" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.button_text}>Sign in</Text>
            </TouchableOpacity>
          </Link>
          <TouchableOpacity
            style={styles.link}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.link_text}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#574294",
    padding: "6%",
  },
  body: {
    width: "100%",
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
    rowGap: 16,
  },
  h1: {
    fontWeight: "900",
    fontSize: 34,
    color: "#9747FF",
    height: 80,
  },
  input: {
    width: "100%",
    height: 65,
    backgroundColor: "white",
    padding: 20,
    paddingRight: 10,
    borderRadius: 10,
    color: "#626262",
    fontSize: 16,
    fontWeight: "600",
  },
  button_container: {
    width: "100%",
    paddingTop: 32,
    gap: 16,
  },
  button: {
    backgroundColor: "#4F12FA42",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  button_text: {
    fontSize: 20,
    fontWeight: "600",
  },
  link: {
    alignItems: "flex-end",
  },
  link_text: {
    fontSize: 16,
    fontWeight: "600",
    color: "#498DF2",
  },
});

export default LogInPage;
