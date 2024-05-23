import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';

// Import Components
import CustomModal from '../components/modal';

// Import Style Compontes
import { Title1, Subhead, H1 } from '../styles/typography';
import { useTheme } from '../styles/themeContext';
import { errorToast, generalAlert, showToast } from '../lib/alerts';
import { setToken } from '../api/utils.api';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const LogInPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setupPageRef = "/setup"

  // Modal component hooks
  const [codeEmail, setCodeEmail] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetPass, setResetPass] = useState('');
  const [resetPassConfirm, setResetPassConfirm] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [modalForgotVisible, setModalForgotVisible] = useState(false);
  const [modalResetVisible, setModalResetVisible] = useState(false);

  const serverIP = process.env.EXPO_PUBLIC_SERVER_IP;
  const serverPort = process.env.EXPO_PUBLIC_SERVER_PORT;

  const serverURL = `http://${serverIP}:${serverPort}`;

  const emailChecker = (mail) => {
    return mail.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  const handleResetCode = async () => {
    if (!codeEmail) {
      generalAlert('Please provide an email.');
      return;
    }
    if (!emailChecker(codeEmail)) {
      generalAlert('Please provide a valid email.');
      return;
    }
    try {
      const options = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: codeEmail,
        }),
      };
      const res = await fetch(`${serverURL}/user/loco/reset-code`, options);
      if (res.ok) {
        generalAlert('Code has been sent successfully.');
      } else {
        generalAlert("Please enter a registered locomotive email.");
      }
    } catch (err) {
      if (err.message) {
        generalAlert(err.message);
      }
      else {
        generalAlert("Server connection issues are occuring");
      }
      console.log(err.message);
    }
  };

  const handleReset = async () => {
    if (!resetPass || !resetCode || !resetPassConfirm || !resetEmail) {
      generalAlert('Please provide details required.');
      return;
    }
    if (resetPass != resetPassConfirm) {
      generalAlert('Passwords do not match.');
      return;
    }
    if (!emailChecker(resetEmail)) {
      generalAlert('Please provide a valid email.');
      return;
    }
    // Add further logic if desired for
    /*
    if (!resetPass.match(`^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$`)){
      generalAlert("Please provide a stronger password (minimum 8 characters, 1 special character, 2 numerals, 3 lower case, 2 upper case).");
    }*/
    try {
      const options = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: resetEmail,
          password: resetPass,
          code: resetCode,
        }),
      };
      fetch(`${serverURL}/user/loco/reset-password`, options)
        .then((res) => {
          if (res.ok) {
            generalAlert('Password has been reset successfully.');
          } else {
            generalAlert("Invalid token/ email");
          }
        })
        .catch((err) => {
          generalAlert('Server issues occured.');
          console.log(err.message);
        });
    } catch (err) {
      if (err.message) {
        generalAlert(err.message);
      }
      else {
        issueAlert("Server connection issues are occuring");
      }

      console.log(err.message);
    }
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      generalAlert('Please provide details required.');
      return;
    }
    if (resetPass != resetPassConfirm) {
      generalAlert('Passwords do not match.');
      return;
    }

    try {
      const options = {
        method: 'POST',
        mode: 'cors',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      };
      const res = await fetch(`${serverURL}/user/loco/login`, options);
      if (res.ok) {
        try {
          const data = await res.json();
          const parsedData = JSON.parse(data);
          console.info(parsedData);
          // Awaiting async vs cookies! needed for in loco func with zac merge
          
          await AsyncStorage.setItem('isSignedIn', 'true');
          await AsyncStorage.setItem('userID', toString(parsedData.user.userID));
          await AsyncStorage.setItem('email', email);
          setToken(parsedData.token);
          const fullname = parsedData.user.firstName + " " + parsedData.user.lastName;
          await AsyncStorage.setItem('fullname', fullname);
        } catch (err) {
          generalAlert('Failed to login. Please enter an existing user.');
          console.error(err);
          return;
        }
        router.navigate(setupPageRef);
      } 
      else {
        res.json().then((issue) => {
          if (issue.message) {
            generalAlert(issue.message);
          }
          else {
            generalAlert("Failed to login. Please enter an existing user.");
          }
        });
      }
    } catch (err) {
      generalAlert('Failed to login.');
      console.error(err);
    }
  };

  return (
    <View style={[styles.page, { backgroundColor: theme.appBG }]}>
      <CustomModal
        isVisible={modalForgotVisible}
        onClose={() => setModalForgotVisible(false)}
        style={{ width: '80%', maxWidth: 500 }}
      >
        <View style={{ width: '100%', gap: 16 }}>
          <View style={{ marginBottom: 32, gap: 8 }}>
            <Title1>Send Password Reset Link</Title1>
            <Subhead>
              Enter the email address associated with your account, and we'll
              send you a link to reset your password.
            </Subhead>
          </View>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.bgLevel6, color: theme.textLevel2 },
            ]}
            placeholder='Please enter your email'
            keyboardType='email-address'
            inputMode='email'
            autoComplete='email'
            clearButtonMode='always'
            onChange={(e) => setCodeEmail(e.nativeEvent.text)}
            value={codeEmail}
          />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.bgButton }]}
            onPress={handleResetCode}
          >
            <Text style={styles.button_text}>Send Reset Link</Text>
          </TouchableOpacity>
        </View>
      </CustomModal>
      <CustomModal
        isVisible={modalResetVisible}
        onClose={() => setModalResetVisible(false)}
        style={{ width: '80%', maxWidth: 500 }}
      >
        <View style={{ width: '100%', gap: 16 }}>
          <View style={{ marginBottom: 32, gap: 8 }}>
            <Title1>Reset Your Password</Title1>
            <Subhead>Enter relevant details to reset password.</Subhead>
          </View>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.bgLevel6, color: theme.textLevel2 },
            ]}
            placeholder='Please enter your email'
            keyboardType='email-address'
            inputMode='email'
            autoComplete='email'
            clearButtonMode='always'
            onChange={(e) => setResetEmail(e.nativeEvent.text)}
            value={resetEmail}
          />
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.bgLevel6, color: theme.textLevel2 },
            ]}
            placeholder='Please enter the reset code'
            keyboardType='numeric'
            inputMode='numeric'
            clearButtonMode='always'
            onChange={(e) => setResetCode(e.nativeEvent.text)}
            value={resetCode}
          />
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.bgLevel6, color: theme.textLevel2 },
            ]}
            placeholder='Please enter your new password'
            keyboardType='default'
            clearButtonMode='always'
            onChange={(e) => setResetPass(e.nativeEvent.text)}
            value={resetPass}
          />
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.bgLevel6, color: theme.textLevel2 },
            ]}
            placeholder='Reconfirm password'
            keyboardType='default'
            clearButtonMode='always'
            onChange={(e) => setResetPassConfirm(e.nativeEvent.text)}
            value={resetPassConfirm}
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.bgButton }]}
            onPress={handleReset}
          >
            <Text style={styles.button_text}>Reset Password</Text>
          </TouchableOpacity>
        </View>
      </CustomModal>
      <View style={[styles.body, { backgroundColor: theme.bgModal }]}>
        <H1>Welcome</H1>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.bgLevel6, color: theme.textLevel2 },
          ]}
          placeholder='Please enter your email'
          keyboardType='email-address'
          inputMode='email'
          autoComplete='email'
          clearButtonMode='always'
          onChange={(e) => setEmail(e.nativeEvent.text)}
          value={email}
        />
        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.bgLevel6, color: theme.textLevel2 },
          ]}
          placeholder='Password'
          secureTextEntry
          clearButtonMode='always'
          value={password}
          onChange={(e) => setPassword(e.nativeEvent.text)}
        />
        <View style={styles.button_container}>
          <TouchableOpacity
            style={{
              backgroundColor: theme.bgButton,
              borderRadius: 10,
              padding: 15,
              alignItems: 'center',
            }}
            onPress={handleSubmit}
          >
            <Text style={[styles.button_text, { color: theme.textButton }]}>
              Sign in
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.link}
            onPress={() => setModalForgotVisible(true)}
          >
            <Text style={[styles.link_text, { color: theme.link }]}>
              Forgot your password?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.link}
            onPress={() => setModalResetVisible(true)}
          >
            <Text style={[styles.link_text, { color: theme.link }]}>
              Reset Password with Code
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6%',
  },
  body: {
    width: '100%',
    borderRadius: 32,
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    rowGap: 16,
    width: '80%',
    maxWidth: 500,
  },
  h1: {
    fontWeight: '900',
    fontSize: 34,
    color: '#9747FF',
    height: 80,
  },
  input: {
    width: '100%',
    height: 65,
    padding: 20,
    paddingRight: 10,
    borderRadius: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  button_container: {
    width: '100%',
    paddingTop: 32,
    gap: 16,
  },
  button: {
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  button_text: {
    fontSize: 20,
    fontWeight: '600',
  },
  link: {
    alignItems: 'flex-end',
  },
  link_text: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LogInPage;
