import React from 'react';
import PropTypes from 'prop-types';

import './styles/main.css';

/**
 * Base component
 *
 * NOTE: react stateless component for image zooming
 *
 * */
export default class ContentZoom extends React.Component {

  constructor(...args) {
    super(...args);
    this.zoomedImageElement = null;
    this.contentToZoom = null;
  }

  componentDidMount() {
    this.preloadImages();
    this.contentToZoom = this.zoomedImageElement ? this.renderZoomedImage(this.zoomedImageElement) : null;
    this.handleMouseEnter(this.zoomedImageElement);
    this.handleMouseMove(this.zoomedImageElement);
    this.handleMouseLeave(this.zoomedImageElement);
  }

  preloadImages() {
    [this.props.imageUrl, this.props.largeImageUrl].forEach((imageUrl) => {
      (new Image()).src = imageUrl;
    });
  }

  handleMouseEnter(el) {
    if (!el) return;
    let zoomPercent = this.props.zoomPercent ? this.props.zoomPercent + '%' : '250%';
    let largeImageUrl = this.props.largeImageUrl;
    el.addEventListener('mouseenter', function (e) {
      this.style.backgroundImage = 'url("' + largeImageUrl + '")';
      this.style.backgroundSize = zoomPercent;
    }, false);
  }

  handleMouseLeave(el) {
    let imageUrl = this.props.imageUrl;
    if (!el) return;
    el.addEventListener('mouseleave', function (e) {
      this.style.backgroundSize = 'cover';
      this.style.backgroundPosition = 'center';
      this.style.backgroundImage = 'url("' + imageUrl + '")';
    }, false);
  }

  handleMouseMove(el) {
    if (!el) return;
    el.addEventListener('mousemove', function (e) {

      // getBoundingClientReact gives us various information about the position of the element.
      let dimentions = this.getBoundingClientRect();

      // Calculate the position of the cursor inside the element (in pixels).
      let x = e.clientX - dimentions.left;
      let y = e.clientY - dimentions.top;

      // Calculate the position of the cursor as a percentage of the total size of the element.
      let xpercent = Math.round(100 / (dimentions.width / x));
      let ypercent = Math.round(100 / (dimentions.height / y));

      // Update the background position of the image.
      this.style.backgroundPosition = xpercent + '% ' + ypercent + '%';

    }, false);
  }

  renderZoomedImage(el) {
    if (!el) return;
    // Set the source of the zoomed image.
    el.style.backgroundImage = 'url("' + this.props.imageUrl + '")';
  }

  render() {
    const children = this.props.children !== undefined ? this.props.children : null;

    let height = null;
    let width = null;

    height = this.props.contentHeight ? this.props.contentHeight + 'px' : '100%';
    width = this.props.contentWidth ? this.props.contentWidth + 'px' : '100%';

    return <div>
      <div className="zoomed-image" ref={(elem) => {
        this.zoomedImageElement = elem;
      }} style={{height, width}}>
        {this.contentToZoom}
        {children}
      </div>
    </div>;
  }

}

ContentZoom.propTypes = {
  imageUrl: PropTypes.string,
  largeImageUrl: PropTypes.string,
  zoomPercent: PropTypes.number,
  contentWidth: PropTypes.number,
  contentHeight: PropTypes.number
};
