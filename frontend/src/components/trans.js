import React, { Component } from 'react'
const ls=['src/components/SkrikPage.js','src/components/SkrikPage.css','src/index.js','src/index.html','src/text.py','package.js']
const str = [
    {
        type: "blankFolder",
        displayAddBlank: false,
    },
    {
        type: "folder",
        name: "src",
        status: "open",
        data: [
            {
                type: "blankFolder",
                displayAddBlank: false,
            },
            {
                type: "folder",
                name: "components",
                status: "open",
                data: [
                    {
                        type: "blankFolder",
                        displayAddBlank: false,
                    },
                    {
                        type: "blankFile",
                        displayAddBlank: false,
                    },
                    {
                        type: "file",
                        name: "SkrikPage.js",
                        status: "off",
                    },
                    {
                        type: "file",
                        name: "SkrikPage.css",
                        status: "off"
                    },
                    "EOF"
                ]
            },
            {
                type: "blankFile",
                displayAddBlank: false,
            },
            {
                type: "file",
                name: "index.js",
                status: "off"
            },
            {
                type: "file",
                name: "index.html",
                status: "off"
            },
            {
                type: "file",
                name: "test.py",
                status: "off"
            },
            "EOF"
        ]
    },
    {
        type: "blankFile",
        displayAddBlank: false,
    },
    {
        type: "file",
        name: "package.json",
        status: "off"
    },

]
const transfer = (ls) => {
    //console.log(ls)
    let a = ls.map(ele => ele.split('/'))
    let json = {}
    for(let idx=0;idx<a.length;idx++){
        if(!json.hasOwnProperty(a[idx])){
            json[a[idx]] = {}
        }
    }
    console.log(json)
}
export default transfer