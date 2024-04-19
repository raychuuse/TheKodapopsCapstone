import { View, Image } from 'react-native';

// Import Style Components
import { Title1, Subhead } from './typography';

// Import Componets
import CustomModal from './modal';

const ModalTutorial = ({ isVisable, setIsVisable }) => {
  return (
    <CustomModal
      isVisible={isVisable}
      onClose={() => setIsVisable(false)}
    >
      <View
        style={{
          width: '100%',
          gap: 16,
        }}
      >
        <Title1>Master The App</Title1>
        <Subhead>Essential Tips for Seamless Navigation and Use</Subhead>
        <View
          style={{
            borderRadius: 10,
            aspectRatio: '3/4',
            overflow: 'hidden',
          }}
        >
          <Image
            source={require('../assets/tutorial_1.gif')}
            style={{
              resizeMode: 'contain',
              width: '100%',
              height: '100%',
            }}
          />
        </View>
      </View>
    </CustomModal>
  );
};

export default ModalTutorial;
