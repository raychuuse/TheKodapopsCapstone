import { useContext, useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

// Import Components
import CustomModal from "../components/modal";
import { errorAlert, issueAlert, generalAlert } from '../lib/alerts';

// Import Style Compontes
import { Title1, Body, Subhead } from "../components/typography";

// Import Context
import { useAuth } from "../context/authContext";

const LogInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Modal component hooks
  const [codeEmail, setCodeEmail] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetPass, setResetPass] = useState('');
  const [resetPassConfirm, setResetPassConfirm] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [modalForgotVisible, setModalForgotVisible] = useState(false);
  const [modalResetVisible, setModalResetVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const setupPageRef = "dashboard/setup";

  const {serverURL, signIn, mockMode} = useAuth();

  const handleResetCode = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    if (!codeEmail) {
      generalAlert("Please provide email.");
      return;
    }
    if (mockMode) {
        generalAlert("Code has been sent successfully");
        return;
    }
    try {
      const options = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: codeEmail
        }),
      };
      const res = await fetch(`${serverURL}/har/reset-code`, options)
      if (res.ok) {
        generalAlert("Code has been sent successfully.");
      }
      else {
        issueAlert(res.message);
        //setLoading(false);
      }
    }
    catch (err) {
        errorAlert(err)
        console.log(err.message)
    }
  }

  const handleReset = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    if (!resetPass || !resetCode || !resetPassConfirm || !resetEmail) {
      generalAlert("Please provide details required.");
      return;
    }
    if (resetPass != resetPassConfirm) {
      generalAlert("Passwords do not match.");
      return;
    }
    // Add further logic if desired for mock
    if (mockMode) {
      generalAlert("Password has been reset successfully");
      return;
    }
    try {
      const options = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          code: resetCode
        }),
      };
      const res = await fetch(`${serverURL}/har/reset-password`, options)
      if (res.ok) {
        generalAlert("Password has been reset successfully.");
      }
      else {
        issueAlert(res.message);
        //setLoading(false);
      }
    }
    catch (err) {
        errorAlert(err)
        console.log(err.message)
    }
  }
  
  
  const handleSubmit = async() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    if (!email || !password) {
      generalAlert("Please provide details required.");
      return;
    }
    if (resetPass != resetPassConfirm) {
      generalAlert("Passwords do not match.");
      return;
    }
    /*
    console.log(email);
    console.log(password);
    */
    if (mockMode) {
      router.navigate(setupPageRef)
    }
    try {
      const options = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      };
      const res = await fetch(`${serverURL}/har/login`, options)
      if (res.ok) {
        try {
          await AsyncStorage.setItem('isSignedIn', true);
          await AsyncStorage.setItem('email', email);
          await AsyncStorage.setItem('token', res[0].token);
          signIn();
        }
        catch (err) {
          issueAlert("Failed to login.");
          console.log(err);
          return;
        }
        router.navigate(setupPageRef);
      }
      else {
        issueAlert(res.status);
        //setLoading(false);
      }
    }
    catch (err) {
        //errorAlert(err.message);
        console.log(err.message);
    }
  }

  return (
    <View style={styles.page}>
      <CustomModal isVisible={modalForgotVisible} onClose={() => setModalForgotVisible(false)}>
        <View style={{ width: "100%", gap: 16 }}>
          <View style={{ marginBottom: 32, gap: 8 }}>
            <Title1>Send Password Reset Link</Title1>
            <Subhead>Enter the email address associated with your account, and we'll send you a link to reset your password.</Subhead>
          </View>
          <TextInput
            style={[styles.input, { backgroundColor: "rgb(230,230,230)" }]}
            placeholder="Please enter your email"
            keyboardType="email-address"
            inputMode="email"
            autoComplete="email"
            clearButtonMode="always"
            onChange={e => setCodeEmail(e.nativeEvent.text)}
            value={codeEmail}
          />
          <TouchableOpacity style={styles.button} onPress={handleResetCode}>
            <Text style={styles.button_text}>Send Reset Link</Text>
          </TouchableOpacity>
        </View>
      </CustomModal>
      <CustomModal isVisible={modalResetVisible} onClose={() => setModalResetVisible(false)}>
        <View style={{ width: "100%", gap: 16 }}>
          <View style={{ marginBottom: 32, gap: 8 }}>
            <Title1>Reset Your Password</Title1>
            <Subhead>Enter the email address and set code with your new password for reset.</Subhead>
          </View>
          <TextInput
            style={[styles.input, { backgroundColor: "rgb(230,230,230)" }]}
            placeholder="Please enter your email"
            keyboardType="email-address"
            inputMode="email"
            autoComplete="email"
            clearButtonMode="always"
            onChange={e => setResetEmail(e.nativeEvent.text)}
            value={resetEmail}
          />
          <TextInput
            style={[styles.input, { backgroundColor: "rgb(230,230,230)" }]}
            placeholder="Please enter the reset code"
            keyboardType="numeric"
            inputMode="numeric"
            clearButtonMode="always"
            onChange={e => setResetCode(e.nativeEvent.text)}
            value={resetCode}
          />
          <TextInput
            style={[styles.input, { backgroundColor: "rgb(230,230,230)" }]}
            placeholder="Please enter your new password"
            keyboardType="default"
            clearButtonMode="always"
            onChange={e => setResetPass(e.nativeEvent.text)}
            value={resetPass}
          />
          <TextInput
            style={[styles.input, { backgroundColor: "rgb(230,230,230)" }]}
            placeholder="Reconfirm password"
            keyboardType="default"
            clearButtonMode="always"
            onChange={e => setResetPassConfirm(e.nativeEvent.text)}
            value={resetPassConfirm}
          />
          
          <TouchableOpacity style={styles.button} onPress={handleReset}>
            <Text style={styles.button_text}>Reset Password</Text>
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
          onChange={e => setEmail(e.nativeEvent.text)}
          value={email}
        />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry clearButtonMode="always" value={password} onChange={e => setPassword(e.nativeEvent.text)} />
        <View style={styles.button_container}>
          <TouchableOpacity onPress={handleSubmit} style={styles.button} /*disabled = {loading}*/>
            <Text style={styles.button_text}>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link} onPress={() => setModalForgotVisible(true)}>
            <Text style={styles.link_text}>Forgot your password?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link} onPress={() => setModalResetVisible(true)}>
            <Text style={styles.link_text}>Reset Password with Code</Text>
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
