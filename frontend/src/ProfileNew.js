import React from 'react';
import {IconContext} from "react-icons";
import { GoLocation,GoLink,GoDeviceMobile,GoMail } from "react-icons/go";
import { ImFacebook2, ImGithub} from "react-icons/im";

import './ProfileNew.css';
function Profile(){
    return(
        <div class="profileContainer">
            <div class="photoContainer">
                <img class="photo" src="https://i.imgur.com/1nzuh87.png" alt="photos"></img>
            </div>
            <div class="detailContainer">
                <div class="detailLine">
                    <span>SkirkRealName</span>
                </div>
                <div class="detailLine">
                    <span>SkirkAccount</span>
                </div>
                <div class="detailLine">
                    <IconContext.Provider value={{color: 'white', size: '20px' }}>
                        <ImGithub style={{marginRight:30, marginLeft:5, verticalAlign:'middle'}}/>
                    </IconContext.Provider>
                    <span>Github</span>
                </div>
                <div class="detailLine">
                    <IconContext.Provider value={{color: 'white', size: '20px' }}>
                        <ImFacebook2 style={{marginRight:30, marginLeft:5, verticalAlign:'middle'}}/>
                    </IconContext.Provider>
                    <span>Facebook</span>
                </div>
                <div class="detailLine">
                    <IconContext.Provider value={{color: 'white', size: '20px' }}>
                        <GoLink style={{marginRight:30, marginLeft:5, verticalAlign:'middle'}}/>
                    </IconContext.Provider>
                    <span>WebsiteLink</span>
                </div>
                <div class="detailLine">
                    <IconContext.Provider value={{color: 'white', size: '20px' }}>
                        <GoLocation style={{marginRight:30, marginLeft:5, verticalAlign:'middle'}}/>
                    </IconContext.Provider>
                    <span>Taipei, Taiwan</span>
                </div>
                <div class="detailLine">
                    <IconContext.Provider value={{color: 'white', size: '20px' }}>
                        <GoDeviceMobile style={{marginRight:30, marginLeft:5, verticalAlign:'middle'}}/>
                    </IconContext.Provider>
                    <span>+886-987-654-321</span>
                </div>
                <div class="detailLine">
                    <IconContext.Provider value={{color: 'white', size: '20px' }}>
                        <GoMail style={{marginRight:30, marginLeft:5, verticalAlign:'middle'}}/>
                    </IconContext.Provider>
                    <span>Skirk@webfinal.edu.tw</span>
                </div>
            </div>
        </div>
    )
}
export default Profile