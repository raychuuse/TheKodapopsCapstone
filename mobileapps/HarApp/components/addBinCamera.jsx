import {
  Alert,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AutoFocus, Camera, CameraType, FlashMode } from 'expo-camera';
import { useContext, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';

// Import Components
import Button from './button';
import { LargeTitle } from './typography';
import { useBins } from '../context/binContext';
import { issueAlert } from '../lib/alerts';

/**
 * AddBinCamera Component
 *
 * This component provides functionality to add a bin using the camera to capture an image.
 * It includes camera controls, a text input for bin number, and submission logic.
 *
 * @param {Object} props - Component props
 * @param {function} props.modalCloser - Function to close the modal
 *
 * @returns {JSX.Element} The rendered AddBinCamera component
 */
const AddBinCamera = ({ modalCloser }) => {
  const [type, setType] = useState(CameraType.back); // State for camera type (front/back)
  const [flashMode, setFlashMode] = useState(FlashMode.off); // State for flash mode
  const [flash, setFlash] = useState(false); // State for flash status
  const [permission, requestPermission] = Camera.useCameraPermissions(); // Camera permissions
  const cameraRef = useRef(null); // Reference to the camera component
  const [imageUri, setImageUri] = useState(null); // State for the captured image URI
  const { binData, createBin, getBinData } = useBins(); // Context for bin data and functions

  const [binNumber, setBinNumber] = useState(); // State for the bin number input
  const inputRef = useRef(null); // Reference to the input component
  const MAX_LENGTH = 6; // Maximum length for the bin number input

  /**
   * Function to capture a picture using the camera.
   */
  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, skipProcessing: true }; // Camera options
      const data = await cameraRef.current.takePictureAsync(options); // Capture the picture
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); // Haptic feedback
      setImageUri(data.uri); // Set the image URI state
      console.log(data.uri); // Log the URI for debugging
    }
  };

  /**
   * Handle changes in the bin number input.
   *
   * @param {string} text - The input text
   */
  const handleChange = (text) => {
    setBinNumber(text);
    if (text.length >= MAX_LENGTH) {
      // If text reaches or exceeds max length, remove focus
      inputRef.current.blur();
    }
  };

  /**
   * Toggle the camera type between front and back.
   */
  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  /**
   * Toggle the flash mode between off and torch.
   */
  function toggleFlash() {
    setFlashMode((current) =>
      current === FlashMode.off ? FlashMode.torch : FlashMode.off
    );
    setFlash(!flash);
  }

  /**
   * Verify if the bin number is valid.
   *
   * @param {string} num - The bin number to verify
   * @returns {boolean} True if the bin number is valid, false otherwise
   */
  function VerifyBinNumber(num) {
    // Regex from stack overflow, \d for digits
    if (/^\d+$/.test(num)) {
      // Check for undefined/ null
      valIfExists = getBinData(num) == null;
      if (valIfExists == null) {
        issueAlert('An invalid number has been entered.');
        return false;
      } else {
        return true;
      }
    }
  }

  /**
   * Handle the submission of the bin number.
   */
  function handleSubmit() {
    if (VerifyBinNumber(binNumber)) {
      try {
        createBin({ isFull: false, binNum: binNumber, isBurnt: false });
        Alert.alert('Bin Creation Successful.');
        return;
      } catch (err) {
        console.log(err);
      }
    }
    Alert.alert('Bin Creation Failed, please enter a valid bin number.');
  }

  if (!permission) requestPermission(); // Request camera permission if not granted

  return (
    <>
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
        onPress={handleSubmit}
        iconName='check-circle-outline'
        iconColor='white'
        iconSize={56}
        backgroundColor='transparent'
        style={{ position: 'absolute', bottom: -88, right: -16 }}
      />
    </>
  );
};

export default AddBinCamera;
