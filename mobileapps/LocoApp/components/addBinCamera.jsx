import {
  Alert,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AutoFocus, Camera, CameraType, FlashMode } from 'expo-camera/legacy';
import { useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';

// Import Components
import Button from './button';
import { LargeTitle } from '../styles/typography';

import CustomModal from './modal';

// Import Provider
import { useModal } from '../context/modalContext';
import { useRun } from '../context/runContext';

const AddBinCamera = ({ stop }) => {
  // Providers
  const { modalAddBinVisible, closeAddBinModal, getAddBinModelStop } = useModal();
  const { handleFindBin } = useRun();

  const [type, setType] = useState(CameraType.back);
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const [flash, setFlash] = useState(false);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraRef = useRef(null);
  const [imageUri, setImageUri] = useState(null);

  const [binNumber, setBinNumber] = useState('');
  const inputRef = useRef(null);
  const MAX_LENGTH = 4;

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, skipProcessing: true };
      const data = await cameraRef.current.takePictureAsync(options);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setImageUri(data.uri);
      console.log(data.uri);
    }
  };

  const handleChange = (text) => {
    setBinNumber(text);
    if (text.length >= MAX_LENGTH) {
      // If text reaches or exceeds max length, remove focus
      inputRef.current.blur();
    }
  };

  const addBinHandeler = () => {
    handleFindBin(binNumber, getAddBinModelStop())
    setBinNumber('');
    closeAddBinModal();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  function toggleFlash() {
    setFlashMode((current) =>
      current === FlashMode.off ? FlashMode.torch : FlashMode.off
    );
    setFlash(!flash);
  }

  if (!permission) requestPermission();

  return (
    <CustomModal
      isVisible={modalAddBinVisible}
      onClose={() => {
        setBinNumber('');
        closeAddBinModal();
      }}
      buttonIcon='close-circle-outline'
      style={{ height: '60%', marginTop: 56, width: 600, zIndex: 1000 }}
    >
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          position: 'absolute',
          top: -146,
        }}
      >
        <LargeTitle style={{ color: 'white' }}>Add a Bin</LargeTitle>
        <TextInput
          ref={inputRef}
          style={{
            width: '100%',
            height: 65,
            backgroundColor: 'white',
            padding: 20,
            paddingRight: 10,
            borderRadius: 10,
            color: '#626262',
            fontSize: 16,
            fontWeight: '600',
            marginVertical: 16,
          }}
          placeholder='Please Bin Number'
          keyboardType={Platform.OS === 'android' ? 'numeric' : 'number-pad'}
          inputMode='numeric'
          returnKeyType='done'
          clearButtonMode='always'
          onChangeText={handleChange}
          value={binNumber}
          maxLength={MAX_LENGTH}
        />
      </View>
      <Camera
        ref={cameraRef}
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          flex: 1,
          width: '100%',
          position: 'relative',
        }}
        autoFocus={AutoFocus.on}
        flashMode={flashMode}
        type={type}
      >
        {/* Camera Controls */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            gap: 16,
            flexDirection: 'row',
            padding: 16,
          }}
        >
          <Button
            onPress={toggleCameraType}
            iconName='cameraswitch'
            iconColor='white'
            backgroundColor='rgba(255,255,255,0.4)'
            iconSize={24}
            style={{ paddingVertical: 18 }}
          />
          <Button
            onPress={toggleFlash}
            iconName={flash ? 'flash-on' : 'flash-off'}
            iconColor='white'
            backgroundColor='rgba(255,255,255,0.4)'
            iconSize={24}
            style={{ paddingVertical: 18 }}
          />
        </View>
        {/* Capture Button */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            alignItems: 'center',
            paddingBottom: 32,
          }}
        >
          <TouchableOpacity
            onPress={takePicture}
            style={{
              backgroundColor: 'rgba(255,255,255,0.4)',
              width: 64,
              height: 64,
              borderRadius: 999,
              borderColor: 'white',
              borderWidth: 2,
              borderStyle: 'solid',
            }}
          />
        </View>
      </Camera>
      <Button
        onPress={() => {
          if (binNumber.length < MAX_LENGTH) {
            Alert.alert(
              'Missing Bin Number!',
              `Please ensure there is a Bin Number with a length of ${MAX_LENGTH} digits.`
            );
          } else {
            Alert.alert(
              'Are you sure?',
              `Are you sure you would like to add Bin ${binNumber} to this siding?`,
              [
                { text: "No, Don't!" },
                { text: 'Yes, Add it.', onPress: addBinHandeler },
              ]
            );
          }
        }}
        iconName='check-circle-outline'
        iconColor='white'
        iconSize={56}
        backgroundColor='transparent'
        style={{ position: 'absolute', bottom: -88, right: -16 }}
      />
    </CustomModal>
  );
};

export default AddBinCamera;
