import React, { useState, useRef } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import PagerView from 'react-native-pager-view';

// Import Style Components
import { Title1, Subhead, Title2 } from './typography';

// Import Components
import CustomModal from './modal';

// Import images
const image1 = require('../assets/tutorial_1.gif');
const image2 = require('../assets/tutorial_2.gif');
const image3 = require('../assets/tutorial_3.gif');

// Data for the tutorial slides
const TutorialData = [
  {
    header: 'Marking Bins as Full',
    description:
      'See how to mark a bin as full with a simple swipe at the siding.',
    image: image2,
  },
  {
    header: 'Quick Swipe Actions for Bin Reports',
    description:
      'Learn how to swipe to report missing, damaged, or burnt bins with this easy tutorial.',
    image: image1,
  },
  {
    header: 'Add Bins with Camera',
    description:
      'Discover how to use your camera to add a bin to the siding in just a few taps.',
    image: image3,
  },
];

/**
 * ModalTutorial Component
 *
 * This component renders a modal with a tutorial carousel to guide users through app features.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isVisable - Boolean to control the visibility of the modal
 * @param {function} props.setIsVisable - Function to set the visibility of the modal
 *
 * @returns {JSX.Element} The rendered ModalTutorial component
 */
const ModalTutorial = ({ isVisable, setIsVisable }) => {
  const pagerViewRef = useRef(null); // Reference to the PagerView component
  const [activeSlide, setActiveSlide] = useState(0); // State for the currently active slide

  /**
   * Function to navigate to a specific slide in the carousel
   * @param {number} pageIndex - The index of the slide to navigate to
   */
  const goToSlide = (pageIndex) => {
    pagerViewRef.current?.setPage(pageIndex); // Set the page index for the PagerView
  };

  return (
    <CustomModal
      isVisible={isVisable} // Control modal visibility
      onClose={() => setIsVisable(false)} // Close modal handler
      style={styles.modalStyle} // Custom modal styles
    >
      <View style={{ width: '100%', gap: 16 }}>
        <Title1>Master The App</Title1>

        {/* Carousel */}
        <PagerView
          style={styles.pagerViewStyle}
          initialPage={0} // Set initial page
          ref={pagerViewRef} // Reference for PagerView
          onPageSelected={(e) => setActiveSlide(e.nativeEvent.position)} // Update active slide on page change
        >
          {TutorialData.map((item, index) => (
            <View key={index}>
              {/* Slide header */}
              <Title2>{item.header}</Title2>
              {/* Slide description */}
              <Subhead style={{ paddingBottom: 16 }}>
                {item.description}
              </Subhead>
              <View style={styles.imageContainer}>
                {/* Slide image */}
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
                activeSlide == index ? styles.activeDot : styles.inactiveDot, // Highlight active dot
              ]}
              onPress={() => goToSlide(index)} // Navigate to selected slide
              accessible={true}
              accessibilityLabel={`Go to slide ${index + 1}`} // Accessibility label
            />
          ))}
        </View>
      </View>
    </CustomModal>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  modalStyle: {
    width: '80%', // Width of the modal
  },
  pagerViewStyle: {
    minHeight: 480, // Minimum height of the pager view
  },
  imageContainer: {
    borderRadius: 10, // Rounded corners for the image container
    aspectRatio: '3/4', // Aspect ratio for the image container
    overflow: 'hidden', // Hide overflow content
  },
  image: {
    resizeMode: 'contain', // Resize the image to contain within the container
    width: '100%', // Full width
    height: '100%', // Full height
  },
  dotContainer: {
    flexDirection: 'row', // Layout dots in a row
    justifyContent: 'center', // Center the dots
    paddingVertical: 20, // Vertical padding
  },
  dot: {
    width: 16, // Width of the dot
    height: 16, // Height of the dot
    borderRadius: 5, // Rounded corners for the dot
    marginHorizontal: 12, // Horizontal margin between dots
  },
  activeDot: {
    backgroundColor: 'rgba(0, 0, 0, 0.92)', // Color for active dot
  },
  inactiveDot: {
    backgroundColor: 'gray', // Color for inactive dot
  },
});

export default ModalTutorial;
