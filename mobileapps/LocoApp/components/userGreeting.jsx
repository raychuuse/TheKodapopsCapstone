import { View } from 'react-native';

// Styles
import GreetingMessage from '../lib/greetingMessage';

// Componets
import Container from './container';

// Styles
import { Title2, Title1 } from '../styles/typography';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function UserGreeting() {
  const [fullname, setName] = useState('');

  useEffect(() => {
    async function getName() {
      await AsyncStorage.getItem('fullname')
        .then((name) => {
          if (name !== null && name) {
            setName(name);
          }
        })
        .catch((err) => {
          setName('Awaiting Cache');
          errorToast(err);
        });
    }

    getName();
  }, []);

  return (
    <Container style={{ flex: 1 }}>
      <View style={{ alignItems: 'center' }}>
        <Title1>
          <GreetingMessage />
        </Title1>
        <Title2>{fullname}</Title2>
      </View>
    </Container>
  );
}
