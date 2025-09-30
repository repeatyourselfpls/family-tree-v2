import { MdClose } from 'react-icons/md';
import navbarImage from '../assets/navbar.png';
import nodeImage from '../assets/node.png';
import spouseImage from '../assets/spouse.png';
import themeImage from '../assets/theme.png';
import Slideshow from './Slideshow';

export type WelcomeModalProps = {
  visible: boolean;
  onClose: () => void;
};

const WelcomeModal = ({ visible, onClose }: WelcomeModalProps) => {
  if (!visible) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const slideshowImages = [
    {
      src: nodeImage,
      caption: 'Click on any person to view and edit their details',
    },
    {
      src: spouseImage,
      caption: 'Add spouses and children to build your family tree',
    },
    {
      src: navbarImage,
      caption: 'Save and share your tree with your family',
    },
    {
      src: themeImage,
      caption: 'Toggle between light and dark themes',
    },
  ];

  return (
    <div className="welcome-modal-backdrop" onClick={handleBackdropClick}>
      <div className="welcome-modal">
        <button
          className="welcome-modal-close"
          onClick={onClose}
          aria-label="Close welcome modal"
        >
          <MdClose />
        </button>

        <div className="welcome-modal-content">
          {/* Left side - Copy */}
          <div className="welcome-modal-copy">
            <div className="welcome-modal-header">
              <h1>Welcome to KinSketch</h1>
              <p className="welcome-modal-subtitle">
                Build and visualize your family tree with ease
              </p>
            </div>

            <div className="welcome-modal-features">
              <h2>Getting Started</h2>
              <ul>
                <li>
                  <strong>Click any person</strong> to view and edit their
                  information
                </li>
                <li>
                  <strong>Add family members</strong> by creating spouses and
                  descendants
                </li>
                <li>
                  <strong>Save your progress</strong> with automatic local
                  storage
                </li>
                <li>
                  <strong>Export and import</strong> your trees to share with
                  others
                </li>
              </ul>
            </div>

            <div className="welcome-modal-tips">
              <h2>Pro Tips</h2>
              <ul>
                <li>
                  Use the theme toggle to switch between light and dark modes
                </li>
                <li>Your tree automatically saves as you make changes</li>
                <li>Click and drag to move around the canvas</li>
                <li>Use the reset button to start fresh anytime</li>
              </ul>
            </div>

            <div className="welcome-modal-cta-container">
              <button className="welcome-modal-cta" onClick={onClose}>
                Start Building Your Family Tree
              </button>
              <a
                href="https://suryacodes.com"
                target="_blank"
                rel="noopener noreferrer"
                className="welcome-modal-inline-credit"
              >
                made by surya
              </a>
            </div>
          </div>

          {/* Right side - Slideshow */}
          <div className="welcome-modal-slideshow">
            <Slideshow images={slideshowImages} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
