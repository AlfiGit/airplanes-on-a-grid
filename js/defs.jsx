import React from 'react'

export default function GameDefs() {
    return <defs xmlns="http://www.w3.org/2000/svg">
        <path id="plus" d="M20 50 H80 M50 20 V80 Z" strokeWidth="10%"></path>
        <use id="add" xlinkHref="#plus" stroke="black"></use>
        <use id="cross-no-color" xlinkHref="#plus" transform="rotate(45 50 50)"></use>
        <use id="cross" xlinkHref="#cross-no-color" stroke="black"></use>
        <polygon id="arrowhead" points="-12,0 12,0 0,-16" fill="black"></polygon>
        <g id="rotate">
            <path d="M75 50 A25 25 0 1 1 50 25" strokeWidth="10%" stroke="black" fill="none"></path>
            <use xlinkHref="#arrowhead" transform="translate(75 50)"></use>
        </g>
        <g id="move">
            <use xlinkHref="#add" transform="matrix(0.83, 0, 0, 0.83, 8.5, 8.5)"></use>
            <use xlinkHref="#arrowhead" transform="translate(50 25)"></use>
            <use xlinkHref="#arrowhead" transform="translate(50 75) rotate(180)"></use>
            <use xlinkHref="#arrowhead" transform="translate(25 50) rotate(-90)"></use>
            <use xlinkHref="#arrowhead" transform="translate(75 50) rotate(90)"></use>
        </g>
        <use id="hit" xlinkHref="#target-no-stroke" stroke="white"></use>
        <g id="send">
            <path></path>
        </g>
        <polygon id="play" points="25,20 25,80 75,50" fill="black"></polygon>
        <mask id="target-hole">
            <rect x="0" y="0" width="100" height="100" fill="white"></rect>
            <circle cx="50" cy="50" r="15" fill="silver" fill="black"></circle>
        </mask>
        <g id="target-no-stroke">
            <use xlinkHref="#plus" mask="url(#target-hole)"></use>
            <circle cx="50" cy="50" r="15" fill="transparent" strokeWidth="10"></circle>
        </g>
        <use id="target" xlinkHref="#target-no-stroke" stroke="red"></use>
        <use id="no-target" xlinkHref="#target-no-stroke" stroke="#333"></use>
        <use id="guess" xlinkHref="#target-no-stroke" stroke="#c27"></use>
        <polygon id="airplane" points="0,-5 -5,5 -25,5 -25,15 -5,15 -5,25 -15,25 -15,35 15,35 15,25 5,25 5,15 25,15 25,5 5,5 0,-5"
        style={{pointerEvents: 'none'}}></polygon>
        <g id="circle-btn">
            <circle cx="0" cy="-10" r="3"></circle>
            <path d="M-1 -9.5 l1 -1 l1 1" stroke="white" fill="none" strokeWidth="0.5"></path>
        </g>
        <rect id="square-mark" x="30" y="30" width="40" height="40"></rect>
        <use id="mark-H" xlinkHref="#square-mark" transform="rotate(45 50 50)" fill="grey"></use>
        <use id="mark-B" xlinkHref="#square-mark" fill="grey"></use>
        <circle id="mark-A" cx="50" cy="50" r="20" stroke="grey" strokeWidth="10" fill="transparent"></circle>
        <g id="linearGradients">
        <linearGradient id="blue" gradientTransform="rotate(90)">
            {/* #99c9ff 2%, #1176e8 50%, #106ad1 50%, #1268ca 88%, #115eb6 100% */}
            <stop stopColor="#99c9ff" offset="2%"></stop>
            <stop stopColor="#1176e8" offset="50%"></stop>
            <stop stopColor="#106ad1" offset="50%"></stop>
            <stop stopColor="#1268ca" offset="88%"></stop>
            <stop stopColor="#115eb6" offset="100%"></stop>
        </linearGradient>
        <linearGradient id="blue" gradientTransform="rotate(90)">
            {/* #99c9ff 2%, #1176e8 50%, #106ad1 50%, #1268ca 88%, #115eb6 100% */}
            <stop stopColor="#99c9ff" offset="2%"></stop>
            <stop stopColor="#1176e8" offset="50%"></stop>
            <stop stopColor="#106ad1" offset="50%"></stop>
            <stop stopColor="#1268ca" offset="88%"></stop>
            <stop stopColor="#115eb6" offset="100%"></stop>
        </linearGradient>
        <linearGradient id="blue-hover" gradientTransform="rotate(90)">
            <stop stopColor="#115eb6" offset="2%"></stop>
            <stop stopColor="#1268ca" offset="50%"></stop>
            <stop stopColor="#106ad1" offset="50%"></stop>
            <stop stopColor="#1176e8" offset="88%"></stop>
            <stop stopColor="#99c9ff" offset="100%"></stop>
        </linearGradient>
        <linearGradient id="green" gradientTransform="rotate(90)">
            {/* #99ff99 2%, #12e912 50%, #10d110 50%, #11c911 88%, #11b411 100% */}
            <stop stopColor="#99ff99" offset="2%"></stop>
            <stop stopColor="#12e912" offset="50%"></stop>
            <stop stopColor="#10d110" offset="50%"></stop>
            <stop stopColor="#11c911" offset="88%"></stop>
            <stop stopColor="#11b411" offset="100%"></stop>
        </linearGradient>
        <linearGradient id="green-hover" gradientTransform="rotate(90)">
            {/* #99ff99 2%, #12e912 50%, #10d110 50%, #11c911 88%, #11b411 100% */}
            <stop stopColor="#11b411" offset="2%"></stop>
            <stop stopColor="#11c911" offset="50%"></stop>
            <stop stopColor="#10d110" offset="50%"></stop>
            <stop stopColor="#12e912" offset="88%"></stop>
            <stop stopColor="#99ff99" offset="100%"></stop>
        </linearGradient>
        <linearGradient id="gold" gradientTransform="rotate(90)">
            {/* #fdff99 2%, #e5e811 50%, #dbdf11 50%, #c7ca12 88%, #b3b611 100% */}
            <stop stopColor="#fdff99" offset="2%"></stop>
            <stop stopColor="#e5e811" offset="50%"></stop>
            <stop stopColor="#dbdf11" offset="50%"></stop>
            <stop stopColor="#c7ca12" offset="88%"></stop>
            <stop stopColor="#b3b611" offset="100%"></stop>
        </linearGradient>
        <linearGradient id="gold-hover" gradientTransform="rotate(90)">
            {/* #fdff99 2%, #e5e811 50%, #dbdf11 50%, #c7ca12 88%, #b3b611 100% */}
            <stop stopColor="#b3b611" offset="2%"></stop>
            <stop stopColor="#c7ca12" offset="50%"></stop>
            <stop stopColor="#dbdf11" offset="50%"></stop>
            <stop stopColor="#e5e811" offset="88%"></stop>
            <stop stopColor="#fdff99" offset="100%"></stop>
        </linearGradient>
        </g>
    </defs>
}