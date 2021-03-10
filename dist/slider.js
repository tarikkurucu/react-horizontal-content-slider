function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
const propTypes = {
  isRangeShowing: PropTypes.boolean,
  sliderContainerClassName: PropTypes.string,
  sliderClassName: PropTypes.string,
  leftArrClassName: PropTypes.string,
  rightArrClassName: PropTypes.string,
  arrowIcon: PropTypes.string
};
const defaultProps = {
  isRangeShowing: true,
  sliderContainerClassName: "content-slider",
  sliderClassName: "slider",
  arrowIcon: "icon-banner-arrow"
};

class SliderComponent extends Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "sliderContainer", /*#__PURE__*/React.createRef());

    _defineProperty(this, "contentSliderContainer", /*#__PURE__*/React.createRef());

    _defineProperty(this, "state", {
      activeIndex: 0
    });

    _defineProperty(this, "itemWidth", 0);

    _defineProperty(this, "showingCount", 2);

    _defineProperty(this, "getElementWidth", element => {
      var style = element.currentStyle || window.getComputedStyle(element),
          width = element.offsetWidth,
          // or use style.width
      margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
      return width + margin;
    });

    _defineProperty(this, "handleTouchStart", evt => {
      this.xDown = evt.touches[0].clientX;
      this.yDown = evt.touches[0].clientY;
    });

    _defineProperty(this, "handleTouchMove", evt => {
      if (!this.xDown || !this.yDown) {
        return;
      }

      this.xUp = evt.touches[0].clientX;
      this.yUp = evt.touches[0].clientY;
      let xDiff = this.xDown - this.xUp;
      let yDiff = this.yDown - this.yUp;

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        evt.preventDefault();

        if (xDiff > 0) {
          this.changeActiveIndex(1);
        } else {
          this.changeActiveIndex(-1);
        }
      }

      this.xDown = null;
      this.yDown = null;
    });

    _defineProperty(this, "setItemWidth", () => {
      this.itemWidth = this.getElementWidth(this.sliderContainer.current.children[0]);
      this.showingCount = Math.floor(this.contentSliderContainer.current.offsetWidth / this.itemWidth + 0.2);
    });

    _defineProperty(this, "changeActiveIndex", direction => {
      if (this.state.activeIndex === 0 && direction === -1 || Math.ceil(this.props.children.length / this.showingCount) - 1 === this.state.activeIndex && direction === 1) {
        return;
      }

      this.setState({
        activeIndex: this.state.activeIndex + direction
      });
    });
  }

  componentDidMount() {
    this.itemWidth = this.getElementWidth(this.sliderContainer.current.children[0]);
    this.showingCount = Math.floor(this.contentSliderContainer.current.offsetWidth / this.itemWidth + 0.2);
    this.forceUpdate();

    if (typeof window !== "undefined") {
      window.addEventListener('resize', this.setItemWidth);
    }

    if (typeof window !== "undefined") {
      this.contentSliderContainer.current.addEventListener('touchstart', this.handleTouchStart, false);
    }

    if (typeof window !== "undefined") {
      this.contentSliderContainer.current.addEventListener('touchmove', this.handleTouchMove, false);
    }
  }

  componentWillUnmount() {
    if (typeof window !== "undefined") {
      window.removeEventListener('resize', this.setItemWidth);
    }
  }

  render() {
    let {
      isRangeShowing,
      sliderContainerClassName,
      sliderClassName,
      leftArrClassName,
      rightArrClassName,
      arrowIcon
    } = this.props;
    let containerWidth = this.props.children.length * this.itemWidth;
    let translateValue = this.state.activeIndex * (this.showingCount * this.itemWidth);
    let windowInnerWidth = this.showingCount * this.itemWidth;
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: sliderContainerClassName || "content-slider",
      ref: this.contentSliderContainer
    }, /*#__PURE__*/React.createElement("div", {
      className: sliderClassName || "slider",
      style: {
        transform: `translate(${containerWidth - windowInnerWidth > translateValue ? -translateValue : -(containerWidth - windowInnerWidth)}px,0)`
      },
      ref: this.sliderContainer
    }, this.props.children)), /*#__PURE__*/React.createElement("div", {
      className: "nav-block light-color"
    }, isRangeShowing && this.props.children.length / this.showingCount > 1 && /*#__PURE__*/React.createElement("div", {
      className: "range-item"
    }, /*#__PURE__*/React.createElement("div", {
      className: "range",
      style: {
        width: `${100 / (Math.ceil(this.props.children.length / this.showingCount) || 1) * (this.state.activeIndex + 1)}%`
      }
    })), this.props.children.length / this.showingCount > 1 && /*#__PURE__*/React.createElement("div", {
      className: "slide-arrow-block"
    }, /*#__PURE__*/React.createElement("div", {
      className: "arrow-item " + (leftArrClassName || "") + (0 === this.state.activeIndex ? " passive" : ""),
      onClick: () => {
        this.changeActiveIndex(-1);
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "arrow"
    }, /*#__PURE__*/React.createElement("i", {
      className: arrowIcon || "icon-banner-arrow"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "arrow-item right " + (rightArrClassName || "") + (Math.ceil(this.props.children.length / this.showingCount) - 1 === this.state.activeIndex ? " passive" : ""),
      onClick: () => {
        this.changeActiveIndex(1);
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "arrow"
    }, /*#__PURE__*/React.createElement("i", {
      className: arrowIcon || "icon-banner-arrow"
    }))))));
  }

}

;
SliderComponent.propTypes = propTypes;
SliderComponent.defaultProps = defaultProps;
export default SliderComponent;