# Restaurant Management Mobile App - React Native

This repository contains the source code for the **Restaurant Management Mobile App**, a React Native application developed using **Expo Go**. This mobile app serves as the user-facing counterpart to the **Restaurant Management Web App** (https://github.com/ChaminduWn/Resturant) and is designed to work seamlessly with the same backend and database.

![Minimalist Gray Old Church Photo Brochure (1)](https://github.com/user-attachments/assets/0afbba1b-edbc-4ec0-b9e9-f26fe7ea8ce2)


## Key Features

- **React Native Frontend**: Built using React Native and designed for Android devices.
- **Expo Go**: Simplifies the development and testing process.
- **Backend Integration**: Node.js-powered backend shared with the restaurant management web application.
- **MongoDB Database**: Stores user and food data.
- **User Side Functionality Only**: Admin-side features like adding or deleting food items are exclusive to the web app.
- **Cross-Platform Data Access**: Users can manage their profiles, cart, and payments via the mobile app or web application.

## Screens

The app includes the following screens:

1. **Splash Screen**: Initial screen displayed upon app launch.
2. **Home Screen**: Displays available food items fetched from the backend.
3. **Login Screen**: Allows users to log in to their accounts.
4. **Register Screen**: Enables new users to sign up.
5. **Cart Screen**: Displays items added to the shopping cart usering "add to cart" button.
6. **Shopping Cart Screen**: Displays items added to the shopping cart usering "buy now" button.
7. **PayNow Screen**: Handles payment processing.
8. **Payment Screen**: Displays payment confirmation and details.
9. **Profile Screen**: Shows user profile details.
10. **Edit Profile Screen**: Allows users to update their profile information.

## Prerequisites

Before running this app, ensure you have the following installed:

- Node.js
- npm (preferred package manager)
- Expo CLI
- MongoDB (backend and database must be running)

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/restaurant-management-mobile-app.git
   cd restaurant-management-mobile-app
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Backend**:
   Ensure your backend server (shared with the web app) is running and configured. Update the backend URL in the app's environment configuration file.

4. **Start the App**:
   ```bash
   expo start
   ```
   Use the Expo Go app on your Android device to scan the QR code and run the app.

## App Workflow

1. Users can register or log in to access the app.
2. Browse food items displayed on the home screen (data fetched from the backend).
3. Add items to the cart and proceed to the shopping cart screen for adjustments.
4. Use the PayNow screen for payment processing, then view payment details.
5. Manage user profiles via the Profile and Edit Profile screens.

## Related Projects

- **Restaurant Management Web App**: The web version of this application with additional admin-side functionalities such as adding and deleting food items.

## Technologies Used

- **Frontend**: React Native, Expo Go
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (shared with the web app)

## Future Enhancements

- iOS Compatibility
- Push Notifications for order updates
- Enhanced UI/UX

## License

This project is licensed under the MIT License. See the LICENSE file for details.

