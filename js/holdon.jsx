import React from 'react';
import Navbar from './navbar.jsx';
import { Font } from './utils.jsx';

export default function HoldOnPage({lang='en'}) {
    return  (
    <Font size="2em" className="middle-message">
        <span>Hold On A Moment...</span>
    </Font> )
}