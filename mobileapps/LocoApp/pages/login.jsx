import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Cookie from 'js-cookie';

// Import Components
import CustomModal from '../components/modal';

// Import Style Compontes
import { Title1, Subhead, H1 } from '../styles/typography';
import { useTheme } from '../styles/themeContext';
import { login } from '../api/users.api';
import { router } from 'expo-router';

const emailRegex =/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const LogInPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogin = () => {
      if (email == null || password == null) {
          console.error('Please enter a valid email and password');
          return;
      }

      console.info(emailRegex.test(email), email);
      if (!emailRegex.test(email)) {
          console.error('Please enter a valid email');
          return;
      }

      if (password.length < 5) {
          console.error('Please enter a valid password, 5 or more characters in length');
          return;
      }

      login(email, password)
          .then(response => {
              Cookie.set('token', response.token);
              Cookie.set('user', response.user);
              router.navigate('/setup')
          })
          .catch(err => {
              console.error(err);
          });
  };

  return (
    <View style={[styles.page, { backgroundColor: theme.appBG }]}>
      <CustomModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        style={{ width: '80%', maxWidth: 500 }}
      >
        <View style={{ width: '100%', gap: 16 }}>
          <View style={{ marginBottom: 32, gap: 8 }}>
            <Title1>Reset Your Password</Title1>
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
            onChange={setResetEmail}
            value={resetEmail}
          />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.bgButton }]}
          >
            <Text style={styles.button_text}>Send Reset Link</Text>
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
          onChangeText={setEmail}
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
          onChangeText={setPassword}
        />
        <View style={styles.button_container}>
          <TouchableOpacity onPress={handleLogin}
            style={{
              backgroundColor: theme.bgButton,
              borderRadius: 10,
              padding: 15,
              alignItems: 'center',
            }}
          >
            <Text style={[styles.button_text, { color: theme.textButton }]}>
              Sign in
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.link}
            onPress={() => setModalVisible(true)}
          >
            <Text style={[styles.link_text, { color: theme.link }]}>
              Forgot your password?
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
