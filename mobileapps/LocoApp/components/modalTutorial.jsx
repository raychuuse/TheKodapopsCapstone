import React, { useState, useRef } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import PagerView from 'react-native-pager-view';

// Import Styles
import { Title1, Subhead, Title2 } from '../styles/typography';

// Import Componetns
import CustomModal from './modal';
import { useTheme } from '../styles/themeContext';

const TutorialData = [
  {
    header: 'Marking Bins as Full',
    description:
      'See how to mark a bin as full with a simple swipe at the siding.',
    image: '',
  },
  {
    header: 'Quick Swipe Actions for Bin Reports',
    description:
      'Learn how to swipe to report missing, damaged, or burnt bins with this easy tutorial.',
    image: '',
  },
  {
    header: 'Add Bins with Camera',
    description:
      'Discover how to use your camera to add a bin to the siding in just a few taps.',
    image: '',
  },
];

const ModalTutorial = ({ isVisible, onClose }) => {
  const { theme } = useTheme();

  const pagerViewRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const goToSlide = (pageIndex) => {
    pagerViewRef.current?.setPage(pageIndex);
  };
  return (
    <CustomModal
      isVisible={isVisible}
      onClose={onClose}
      style={{ width: '80%', maxWidth: 800, height: '85%' }}
      buttonIcon=''
    >
      {/* Header */}
      <View style={[styles.HeaderContainer, { borderColor: theme.textLevel2 }]}>
        <MaterialIcons
          name='help'
          size={28}
          color={theme.textLevel2}
        />
        <Title1>Master The App</Title1>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
        >
          <MaterialCommunityIcons
            name='close-circle-outline'
            size={36}
            color={theme.textLevel2}
          />
        </TouchableOpacity>
      </View>
      {/* Page Content */}
      <View style={styles.content}>
        {/* Carousel  */}
        <PagerView
          style={styles.pagerViewStyle}
          initialPage={0}
          ref={pagerViewRef}
          onPageSelected={(e) => setActiveSlide(e.nativeEvent.position)}
        >
          {TutorialData.map((item, index) => (
            <View
              key={index}
              style={{
                backgroundColor: theme.bgLevel6,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
                marginHorizontal: 16,
              }}
            >
              <Title2>{item.header}</Title2>
              <Subhead style={{ paddingBottom: 16 }}>
                {item.description}
              </Subhead>
              <View style={styles.imageContainer}>
                {item.image && (
                  <Image
                    source={item.image}
                    style={styles.image}
                  />
                )}
              </View>
            </View>
          ))}
        </PagerView>
        {/* Dot Container */}
        <View style={styles.dotContainer}>
          {TutorialData.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dot,
                activeSlide === index ? styles.activeDot : styles.inactiveDot,
              ]}
              onPress={() => goToSlide(index)}
              accessible={true}
              accessibilityLabel={`Go to slide ${index + 1}`}
            />
          ))}
        </View>
      </View>
    </CustomModal>
  );
};

export default ModalTutorial;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    width: '100%',
    gap: 8,
    paddingVertical: 16,
  },
  HeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 8,
    borderStyle: 'solid',
    borderBottomWidth: 2,
    paddingLeft: 6,
    paddingBottom: 6,
  },
  debug: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'red',
  },
  pagerViewStyle: {
    flex: 1,
  },
  imageContainer: {
    borderRadius: 10,
    aspectRatio: '3/4',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 16,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 5,
    marginHorizontal: 12,
  },
  activeDot: {
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
  },
  inactiveDot: {
    backgroundColor: 'gray',
  },
  closeButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 10,
    minWidth: 48,
    minHeight: 48,
  },
});
