import React, {Component} from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    isRangeShowing: PropTypes.boolean,
    sliderContainerClassName: PropTypes.string,
    sliderClassName: PropTypes.string,
    leftArrClassName: PropTypes.string,
    rightArrClassName: PropTypes.string,
    arrowIcon: PropTypes.string
}

const defaultProps = {
    isRangeShowing: true,
    sliderContainerClassName: "content-slider",
    sliderClassName: "slider",
    arrowIcon: "icon-banner-arrow"
}


class SliderComponent extends Component {
    sliderContainer = React.createRef();
    contentSliderContainer = React.createRef();
    state = {
        activeIndex: 0
    }
    itemWidth = 0;
    showingCount = 2;

    getElementWidth = (element) => {
        var style = element.currentStyle || window.getComputedStyle(element),
            width = element.offsetWidth, // or use style.width
            margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);

        return width + margin;
    }

    componentDidMount() {
        this.itemWidth = this.getElementWidth(this.sliderContainer.current.children[0]);
        this.showingCount = Math.floor((this.contentSliderContainer.current.offsetWidth / this.itemWidth) + 0.2)
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

    handleTouchStart = (evt) => {
        this.xDown = evt.touches[0].clientX;
        this.yDown = evt.touches[0].clientY;
    };
    handleTouchMove = (evt) => {
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
    };

    setItemWidth = () => {
        this.itemWidth = this.getElementWidth(this.sliderContainer.current.children[0]);
        this.showingCount = Math.floor((this.contentSliderContainer.current.offsetWidth / this.itemWidth) + 0.2)
    }

    changeActiveIndex = (direction) => {
        if ((this.state.activeIndex === 0 && direction === -1) || (Math.ceil(this.props.children.length / this.showingCount) - 1 === this.state.activeIndex && direction === 1)) {
            return;
        }
        this.setState({
            activeIndex: this.state.activeIndex + direction
        })
    }

    componentWillUnmount() {
        if (typeof window !== "undefined") {
            window.removeEventListener('resize', this.setItemWidth);
        }
    }

    render() {
        let {isRangeShowing, sliderContainerClassName, sliderClassName, leftArrClassName, rightArrClassName, arrowIcon} = this.props
        let containerWidth = this.props.children.length * this.itemWidth;
        let translateValue = this.state.activeIndex * (this.showingCount * this.itemWidth);
        let windowInnerWidth = this.showingCount * this.itemWidth;
        return (
            <div>
                <div className={sliderContainerClassName || "content-slider"} ref={this.contentSliderContainer}>
                    <div className={sliderClassName || "slider"}
                         style={{transform: `translate(${(containerWidth - windowInnerWidth) > translateValue ? -translateValue : -(containerWidth - windowInnerWidth)}px,0)`}}
                         ref={this.sliderContainer}>
                        {this.props.children}
                    </div>
                </div>
                <div className="nav-block light-color">
                    {
                        isRangeShowing && (
                            this.props.children.length / this.showingCount > 1 &&
                            <div className="range-item">
                                <div className="range" style={{width:`${(100/((Math.ceil(this.props.children.length / this.showingCount)) || 1 ))*(this.state.activeIndex+1)}%`}}></div>
                            </div>
                        )
                    }


                    {
                        this.props.children.length / this.showingCount > 1 &&
                        <div className="slide-arrow-block">
                            <div className={"arrow-item " + (leftArrClassName || "") +(0 === this.state.activeIndex?" passive":"")} onClick={()=>{
                                this.changeActiveIndex(-1)
                            }}>

                                <div className="arrow">
                                    <i className={arrowIcon || "icon-banner-arrow"}/>
                                </div>
                            </div>
                            <div className={"arrow-item right "+ (rightArrClassName || "")+(Math.ceil(this.props.children.length / this.showingCount) - 1 === this.state.activeIndex?" passive":"")} onClick={()=>{
                                this.changeActiveIndex(1)
                            }}>

                                <div className="arrow">
                                    <i className={arrowIcon || "icon-banner-arrow"}/>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    }
};

SliderComponent.propTypes = propTypes;
SliderComponent.defaultProps = defaultProps;


export default SliderComponent;
