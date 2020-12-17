import React, { useState } from 'react';

const CardInternal = ({card}) => {
  return (
    <div>
      <div className="container">
        { card &&
          <img src={card} width="350px" height="400px"/>
        }
      </div>
    </div>
    
  )
}

export const Cards = (props) => {
  const cardWidth = props.cardWidth || 260; // 卡片宽度
  const cardHeight = props.cardHeight || 300; // 卡片高度
  const leftPad = props.leftPad || 10; // 卡片间水平距离
  const topPad = props.topPad || 6; // 卡片间垂直距离
  const cardBgColor = props.cardBgColor || "#fff"; // 卡片背景色
  const dragDirection = props.dragDirection || "all"; // 卡片拖拽方向
  const borderRadius = props.borderRadius || 10; // 卡片的圆角弧度
  const throwTriggerDistance = props.throwTriggerDistance || 100; // 卡片触发飞出的有效距离
  const throwDistance = props.throwDistance || 1000; // 卡片飞起的移动距离
  const hasBorder = props.hasBorder || false; // 是否开启卡片描边效果
  const hasShadow = props.hasShadow || false; // 是否开启卡片阴影效果

  const [isDrag, setIsDrag] = useState(false);
  const [isThrow, setIsThrow] = useState(false);
  const [needBack, setNeedBack] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [startLeft, setStartLeft] = useState(0);
  const [startTop, setStartTop] = useState(0);
  const [paddingLeft, setPaddingLeft] = useState(0);
  const [paddingTop, setPaddingTop] = useState(0);
  const [firstCardConf, setFirstCardConf ]= useState({left: 0, top: 0});
  const [secondCardConf, setSecondCardConf] = useState({left: 0, top: 0, width: 0, height: 0});
  const [thirdCardConf, setThirdCardConf] = useState({left: 0, top: 0, width: 0, height: 0});
  const [fourthCardConf, setFourthCardConf] = useState({left: 0, top: 0, width: 0, height: 0, opacity: 0});
  
  function touchStart (e) {
    if(isAnimating) return;

    setIsDrag(true);
    setNeedBack(false);
    setIsThrow(false);
    const curTouch = e.touches[0];
    setStartLeft(curTouch.clientX-firstCardConf.left);
    setStartTop(curTouch.clientY-firstCardConf.top);
    
    props.onDragStart();
  }
  function getDistance (x1, y1, x2, y2) {
    var _x = Math.abs(x1 - x2); 
    var _y = Math.abs(y1 - y2); 
    return Math.sqrt(_x * _x + _y * _y);
  }
  function touchMove (e) {
    if(isAnimating) return;
    
    const curTouch=e.touches[0];
    let left=0, top = 0;
    if(dragDirection == "all" || dragDirection == "horizontal") {
      left = curTouch.clientX - startLeft;
    } 
    if(dragDirection == "all" || dragDirection == "vertical") {
      top = curTouch.clientY - startTop;
    }
    setFirstCardConf({left, top});
    var distance=getDistance(0, 0, firstCardConf.left, firstCardConf.top);
    
    props.onDragMove({left: firstCardConf.left, top: firstCardConf.top, distance: distance});
  }
  function touchCancel (e) {
    let distance = getDistance(0, 0, firstCardConf.left, firstCardConf.top);
    setIsDrag(false);
    props.onDragStop({left: firstCardConf.left, top: firstCardConf.top, distance: distance});
    if(isAnimating) return;
    if(distance > throwTriggerDistance){
      makeCardThrow();
    }else{
      makeCardBack();
    }
  }
  function resetAllCardDown () {
    setFirstCardConf({left: 0, top: 0});
    setSecondCardConf({width: (cardWidth - leftPad * 2), height: (cardHeight - topPad * 2), left: leftPad, top: (topPad * 3)});
    setThirdCardConf({width: (cardWidth - leftPad * 4), height: (cardHeight - topPad * 4), left: leftPad * 2, top: (topPad * 6)});
    setFourthCardConf({width: (cardWidth-leftPad*6), height: (cardHeight-topPad*6), left: leftPad*3, top: topPad*9, opacity: 0});
  }

  function resetAllCard(){
    resetAllCardDown();
  }

  function makeCardThrow(){
    setIsThrow(true);
    setNeedBack(false);
    
    var angle = Math.atan2((firstCardConf.top-0), (firstCardConf.left-0));
    setFirstCardConf({left: Math.cos(angle)*throwDistance, top: Math.sin(angle)*throwDistance});
    setSecondCardConf({width: cardWidth, height: cardHeight, left: 0, top: 0});
    setThirdCardConf({width: (cardWidth-leftPad*2), height: (cardHeight-topPad*2), left: leftPad, top: topPad*3});
    setFourthCardConf({width: (cardWidth-leftPad*4), height: (cardHeight-topPad*4), left: leftPad*2, top: topPad*6, opacity: 1});
    setIsAnimating(true);
    
    props.onThrowStart();
    setTimeout(function(){
      setIsThrow(false);
      setIsAnimating(false);
      props.onThrowDone();
      resetAllCard();
    },400);
  }
  function makeCardBack(){
    setIsThrow(false);
    setNeedBack(true);

    if(needBack){
      setFirstCardConf({left: 0, top: 0});
    }
    setIsAnimating(true);
    setTimeout(function(){
      props.onThrowFail();
      setIsAnimating(false);
      setNeedBack(true);
    },400);
  }

  return (
    <div style={{position: "relative", height: '2000px', width: '100%', paddingLeft: `${paddingLeft}px`}}>
      <div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: `${cardWidth}px`, height: `${cardHeight}px`}}>
        <div
          className={`card ${isAnimating ? 'animation' : ''} ${hasShadow ? 'shadowEffect' : ''} ${hasBorder ? 'boderEffect' : ''}`}
          style={{zIndex: 13, width: `${cardWidth}px`, height: `${cardHeight}px`, left: `${firstCardConf.left}px`, top: `${firstCardConf.top}px`, borderRadius: `${borderRadius}px`, borderColor: cardBgColor}}
          onTouchStart={touchStart}
          onTouchMove={touchMove}
          onTouchCancel={touchCancel}
          onTouchEnd={touchCancel}
        >
          <CardInternal card={props.cards[0].image}/>
        </div>
        <div
          className={`card ${isAnimating ? 'animation' : ''} ${hasShadow ? 'shadowEffect' : ''} ${hasBorder ? 'boderEffect' : ''}`}
          style={{zIndex: 12, width: `${secondCardConf.width}px`, height: `${secondCardConf.height}px`, left: `${secondCardConf.left}px`, top: `${secondCardConf.top}px`, borderRadius: `${borderRadius}px`, borderColor: cardBgColor}}
        >
        <CardInternal card={props.cards[1].image}/>
        </div>
        <div
          className={`card ${isAnimating ? 'animation' : ''} ${hasShadow ? 'shadowEffect' : ''} ${hasBorder ? 'boderEffect' : ''}`}
          style={{zIndex: 11, width: `${thirdCardConf.width}px`, height: `${thirdCardConf.height}px`, left: `${thirdCardConf.left}px`, top: `${thirdCardConf.top}px`, borderRadius: `${borderRadius}px`, borderColor: cardBgColor}}
        >
        <CardInternal card={props.cards[2].image}/>
        </div>
        <div
          className={`card ${isAnimating ? 'animation' : ''} ${hasShadow ? 'shadowEffect' : ''} ${hasBorder ? 'boderEffect' : ''}`}
          style={{zIndex: 10, width: `${fourthCardConf.width}px`, height: `${fourthCardConf.height}px`, left: `${fourthCardConf.left}px`, top: `${fourthCardConf.top}px`, borderRadius: `${borderRadius}px`, borderColor: cardBgColor, opacity: fourthCardConf.opacity}}
        >
        </div>
      </div>
    </div>
  )
}