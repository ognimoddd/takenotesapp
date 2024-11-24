# TakeNotes: A Feature-Rich Note-Taking app for Students

## Table of Contents:

<li><b> Introduction </b></li>
<li><b>Technologies Used</b></li>
<li><b> Installation Guide </b> </li>
<li><b> Features </b></li>
<li><b> Demo </b></li>
<li><b> Contributions </b></li>

## Introduction

This immersive note-taking application was developed to help students manage the vast amounts of information they encounter during their studies. 

Born from a deep understanding of student needs and leveraging cutting-edge technologies, this app represents the culmination of extensive research, design, and development efforts. It stands as a testament to the potential of mobile applications to enhance the learning experience and improve academic outcomes.

Built with React Native and Expo, this app offers robust features to enhance the note-taking experience, including user authentication, CRUD operations, advanced search functionality, and extensive customisation options. It also incorporates cutting-edge AI-powered features such as handwriting recognition, image labelling, and note summarisation, pushing the boundaries of what's possible in a mobile note-taking application.

## Technologies Used:

<li> React Native: Frontend framework for mobile app development </li>
<li>Expo: Development platform for React Native</li>
<li>AsyncStorage: Local data storage solution</li>
<li>Google Cloud Vision API: Powers AI features like image labelling and handwriting recognition</li>
<li>React Navigation: For app navigation</li>
<li>Expo AV: For audio playback in text-to-speech feature</li>
<li>Axios: For making HTTP requests</li>
<li>React Native Picker Select: For dropdown menus</li>
<li>Linear Gradient: For stylish UI elements</li>
<li>iOS Simulator: Used for testing and development, specifically iOS 17.2 on iPhone 15 simulator </li>

## Installation Guide:

1. Ensure you have Node.js and npm installed on your machine.
2. Install Expo CLI globally: <code>npm install -g expo-cli</code>
3. Clone the repository: <code>git clone [your-repo-url].</code>
4. Navigate to the project directory: <code>cd [project-name]</code>
5. Install dependencies: <code>npm install</code>
6. Start the project: <code>npm start</code>

## Features:

<li>User Authentication: Secure login and registration system</li>
<li>CRUD Operations: Create, read, update, and delete notes</li>
<li>Search: Quickly find notes based on content or tags</li>
<li>Customisation: Personalise note appearance with various fonts, sizes, and colours</li>
<ol><li>AI-Powered Features:</li>
<ul>
  <li>Text Recognition: Convert images of text into editable notes
  <li>Image Analysis: Automatically detect and label objects in images
  <li>Text Summarisation: Generate concise summaries of lengthy notes </ul></ol>
<li>Sharing Options: Easy sharing of notes with peers</li>
<li>Bookmarking: Mark important notes for quick access</li>
<li>Templates: Pre-defined note templates for different purposes</li>
<li>Text-to-Speech: Listen to your notes for auditory learning</li>
<li>Dynamic Backgrounds: Change app background based on note content or user preference</li>

## Demo:
1. User Authentication & Main Page

https://github.com/user-attachments/assets/c54c990c-2f53-4d0e-a772-df45416b921f


2. Note Editing and Saving


https://github.com/user-attachments/assets/4eb7d91b-07df-4172-9d48-046c2fc27010


3. Template & Customization Options:


https://github.com/user-attachments/assets/09c6254d-905b-4894-a0a5-eca53ed6ea84


4. Text Recognition and Summary
   
https://private-user-images.githubusercontent.com/111580327/342065808-0a76367a-4c24-4480-8b31-2d6c435722b9.mov?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MzE3MTc0OTQsIm5iZiI6MTczMTcxNzE5NCwicGF0aCI6Ii8xMTE1ODAzMjcvMzQyMDY1ODA4LTBhNzYzNjdhLTRjMjQtNDQ4MC04YjMxLTJkNmM0MzU3MjJiOS5tb3Y_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQxMTE2JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MTExNlQwMDMzMTRaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1lOTY1YWQyZGE3MjIwNTczNjIxYmI4YjBhODIyMWU2YjZlMDcwOGQxOGJjNDgyNWZjNzBiNDgwN2QyZjQwYzc5JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.xLphY0M3EvLDhpDvmHaplLbasWnMd2L8P4MTDi2wnVY

5. Analyse Image

https://private-user-images.githubusercontent.com/111580327/342066625-2526f955-014e-40f0-80ce-a5f326e52ffa.mov?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MzE3MTc0OTQsIm5iZiI6MTczMTcxNzE5NCwicGF0aCI6Ii8xMTE1ODAzMjcvMzQyMDY2NjI1LTI1MjZmOTU1LTAxNGUtNDBmMC04MGNlLWE1ZjMyNmU1MmZmYS5tb3Y_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQxMTE2JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MTExNlQwMDMzMTRaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT00ODRmZGFmOWQwOTM3MzcxYzM2OTQ0YmI0OGQ0MzA1ZWE5ZjY4OTg0YmRmMTI5ZmNlYWQ2YTA0NWE1ZWFlMjcyJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.UemKuTv__jYXVDCCHgOEaGiZqXwasJ0uPX9rhm_JKsw

6. Print & Sharing Options

https://private-user-images.githubusercontent.com/111580327/342067062-1bb81422-c70e-48c5-887b-1fb5bb32223e.mov?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MzE3MTc0OTQsIm5iZiI6MTczMTcxNzE5NCwicGF0aCI6Ii8xMTE1ODAzMjcvMzQyMDY3MDYyLTFiYjgxNDIyLWM3MGUtNDhjNS04ODdiLTFmYjViYjMyMjIzZS5tb3Y_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQxMTE2JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MTExNlQwMDMzMTRaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT00YWRlYmRlNGM5MTYxMmY1ODNiZWE2ZTU2MDNkNWQxYzVkMDhjNGI2MzFkZWQ5YzkyNDg4OTk5NWM4NjQ3MzZkJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.VkwJZHwPQ8l4ajmrKc2r3qHzTJ5DJSQMhmah0mJVAMY


## Contributions:

I am committed to a fully transparent development process and would greatly appreciate any contributions. Whether you are helping to fix bugs, proposing new features, or improving documentation - I would love to have your contribution and/or feedback. Thank you for checking out my repository!

