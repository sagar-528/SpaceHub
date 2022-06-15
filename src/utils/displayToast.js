import Toast from 'react-native-simple-toast';

export const displayToast = message => {
  Toast.show(message, Toast.LONG, [
    'RCTModalHostViewController',
    'UIAlertController',
  ]);
};


